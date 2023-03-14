import { ACTIVITY_MODEL, ACTIVITY_TYPE, STATUS_MSG } from '@/constants';
import { awardService } from '@/services';

export const getAwards = async (req, res) => {
  try {
    const { filterBy, cursor } = req.query;
    const result = await awardService.loadAwards(filterBy, cursor);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const getAward = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await awardService.getOne(id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const createAward = async (req, res) => {
  try {
    const { input } = req.body;
    const result = await awardService.createAward(input);
    //TODO Send Email to customer
    //TODO Activity
    const activityToSave = {
      userId: req.user.id,
      victimId: result.id,
      model: ACTIVITY_MODEL.AWARD,
      type: ACTIVITY_TYPE.CREATE,
      metadata: { ...req.body, status: STATUS_MSG.SUCCEED }
    };
    await activityService.createActivity(activityToSave);
    res.status(200).json(result);
  } catch (e) {
    const activityToSave = {
      userId: user.id,
      model: ACTIVITY_MODEL.AWARD,
      type: ACTIVITY_TYPE.CREATE,
      metadata: {
        ...req.body,
        status: STATUS_MSG.FAILED,
        error: e.message,
        function: 'createAward'
      }
    };
    await activityService.createActivity(activityToSave);
    res.status(500).json(e.message);
  }
};

export const acceptAward = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const result = await awardService.acceptAward(id, user.id);
    //TODO Send Email to customer
    //TODO Activity
    const activityToSave = {
      userId: user.id,
      victimId: result.id,
      model: ACTIVITY_MODEL.AWARD,
      type: ACTIVITY_TYPE.UPDATE,
      metadata: { ...req.params, status: STATUS_MSG.SUCCEED }
    };
    await activityService.createActivity(activityToSave);
    res.status(200).json(result);
  } catch (e) {
    const activityToSave = {
      userId: user.id,
      model: ACTIVITY_MODEL.AWARD,
      type: ACTIVITY_TYPE.UPDATE,
      metadata: {
        ...req.body,
        status: STATUS_MSG.FAILED,
        error: e.message,
        function: 'acceptAward'
      }
    };
    await activityService.createActivity(activityToSave);
    res.status(500).json(e.message);
  }
};

export const declineAward = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const result = await awardService.declineAward(id, user.id);
    //TODO Send Email to customer
    //TODO Activity
    const activityToSave = {
      userId: user.id,
      victimId: result.id,
      model: ACTIVITY_MODEL.AWARD,
      type: ACTIVITY_TYPE.UPDATE,
      metadata: { ...req.params, status: STATUS_MSG.SUCCEED }
    };
    await activityService.createActivity(activityToSave);
    res.status(200).json(result);
  } catch (e) {
    const activityToSave = {
      userId: user.id,
      model: ACTIVITY_MODEL.AWARD,
      type: ACTIVITY_TYPE.UPDATE,
      metadata: {
        ...req.body,
        status: STATUS_MSG.FAILED,
        error: e.message,
        function: 'declineAward'
      }
    };
    await activityService.createActivity(activityToSave);
    res.status(500).json(e.message);
  }
};
