import { Activity, Point, Tablet, Transaction, User } from '@/models';
import { ACTIVITY_MODEL, ACTIVITY_TYPE, APP_MESSAGE, STATUS_MSG } from '@/constants';
import { fractionateHelper, cursorHelper } from '@/helpers';

export const createActivity = async ({ userId, model, victimId, type, metadata }) => {
  const activity = await Activity.query().insert({
    userId,
    victimId,
    model,
    type,
    metadata
  });
  return { data: activity, message: APP_MESSAGE.USER.SUCCESS };
};

export const deleteActivity = async (id) => {
  const activity = await Activity.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.ACTIVITY.NOT_FOUND,
    type: 'NOT_FOUND'
  });
  await activity.$query().delete();
  return {
    message: APP_MESSAGE.ACTIVITY.SUCCESS_DELETE
  };
};

export const getActivities = async (filterBy, cursor) => {
  try {
    let queryBuilder;
    const pageCursor = cursorHelper('activity', cursor);
    const { filter } = await fractionateHelper('activity');
    queryBuilder = filter(filterBy);
    const { results, total } = await queryBuilder
      .page(pageCursor.page, pageCursor.size)
      .withGraphFetched('[user]');

    const parsedActivities = await parseActivities(results);
    return {
      data: parsedActivities,
      pageInfo: {
        ...pageCursor,
        total
      }
    };
  } catch (error) {
    console.log(error);
  }
};

const parseActivities = async (data) => {
  let victim = {};
  const activityList = await Promise.all(
    data.map(async (activity) => {
      const { metadata, victimId, ...rest } = activity;
      if (activity.model === ACTIVITY_MODEL.USER) {
        victim = rest.user;
      } else if (activity.model === ACTIVITY_MODEL.TABLET) {
        victim = await Tablet.query().findOne({ id: victimId }).withGraphFetched('[location]');
      } else if (activity.model === ACTIVITY_MODEL.TRANSACTION) {
        victim = await Transaction.query()
          .findOne({ id: victimId })
          .withGraphFetched('[user, reward.[product], location, assignee, point ]');
      } else if (activity.model === ACTIVITY_MODEL.POINT) {
        victim = await Point.query()
          .findOne({ id: victimId })
          .withGraphFetched('[userLocation.[user, location]]');
      }
      const filteredData = {
        ...rest,
        victimId,
        attributes: generateAttributes({
          metadata,
          victim,
          model: activity.model,
          type: activity.type
        })
      };
      return filteredData;
    })
  );
  return activityList;
};

const generateAttributes = ({ metadata, victim, model, type }) => {
  const { status, body, error } = metadata;
  let attributeObj = {};
  switch (type) {
    case ACTIVITY_TYPE.CREATE:
      if (status === STATUS_MSG.SUCCEED) {
        if (model === ACTIVITY_MODEL.USER) {
          attributeObj = {
            description: `${victim?.firstName} ${victim?.lastName} has been created.`
          };
        } else if (model === ACTIVITY_MODEL.TABLET) {
          attributeObj = {
            description: `${victim.name} has been created.`
          };
        } else if (model === ACTIVITY_MODEL.TRANSACTION) {
          attributeObj = {
            description: `${'The transaction'} has been created.`
          };
        } else if (model === ACTIVITY_MODEL.POINT) {
          attributeObj = {
            description: `${'The point'} has been created.`
          };
        }
      }
      break;
    case ACTIVITY_TYPE.UPDATE:
      if (status === STATUS_MSG.SUCCEED) {
        if (model === ACTIVITY_MODEL.USER) {
          attributeObj = {
            description: `${victim?.firstName} ${victim?.lastName} has been updated.`
          };
        } else if (model === ACTIVITY_MODEL.TABLET) {
          attributeObj = {
            description: `${victim.name} has been updated.`
          };
        } else if (model === ACTIVITY_MODEL.TRANSACTION) {
          attributeObj = {
            description: `${'The transaction'} has been updated.`
          };
        } else if (model === ACTIVITY_MODEL.POINT) {
          attributeObj = {
            description: `${'The point'} has been updated.`
          };
        }
      }
      break;
    case ACTIVITY_TYPE.DELETE:
      break;
    case ACTIVITY_TYPE.CHECKIN:
      if (status === STATUS_MSG.SUCCEED) {
        if (model === ACTIVITY_MODEL.USER) {
          attributeObj = {
            description: `${victim?.firstName} ${victim?.lastName} has been checked in.`
          };
        }
      }
      break;
    case ACTIVITY_TYPE.SIGNUP:
      if (status === STATUS_MSG.SUCCEED) {
        if (model === ACTIVITY_MODEL.USER) {
          attributeObj = {
            description: `${victim.firstName} ${victim.lastName} has been signed in.`
          };
        }
      }
      break;
    case ACTIVITY_TYPE.LOGIN:
      if (status === STATUS_MSG.SUCCEED) {
        if (model === ACTIVITY_MODEL.USER) {
          attributeObj = {
            description: `${victim.firstName} ${victim.lastName} has been logged in.`
          };
        } else if (model === ACTIVITY_MODEL.TABLET) {
          attributeObj = {
            description: `${victim.name} has been logged in.`
          };
        }
      }
      break;
    case ACTIVITY_TYPE.GET:
      if (status === STATUS_MSG.SUCCEED) {
        if (model === ACTIVITY_MODEL.USER) {
          attributeObj = {
            description: `got the token.`
          };
        } else if (model === ACTIVITY_MODEL.TABLET) {
          attributeObj = {
            description: `got tablet info.`
          };
        }
      }
      break;
    case ACTIVITY_TYPE.REQUEST:
      if (status === STATUS_MSG.SUCCEED) {
        if (model === ACTIVITY_MODEL.TRANSACTION) {
          attributeObj = {
            description: `${'The transaction'} has been requested by ${victim.user.firstName} ${
              victim.user.lastName
            }!`
          };
        }
      }
      break;
    case ACTIVITY_TYPE.ACCEPT:
      if (status === STATUS_MSG.SUCCEED) {
        if (model === ACTIVITY_MODEL.TRANSACTION) {
          attributeObj = {
            description: `${'The transaction'} has been accepted by ${victim.assignee.firstName} ${
              victim.assignee.lastName
            }!`
          };
        }
      }
      break;
    case ACTIVITY_TYPE.DECLINE:
      if (status === STATUS_MSG.SUCCEED) {
        if (model === ACTIVITY_MODEL.TRANSACTION) {
          attributeObj = {
            description: `${'The transaction'} has been accepted by ${
              victim?.assignee?.firstName
            } ${victim?.assignee?.lastName}!`
          };
        }
      }
      break;
    default:
      break;
  }
  if (status === STATUS_MSG.FAILED) {
    attributeObj = { description: error, body };
  }
  return { ...attributeObj, status };
};
