import { ACTIVITY_MODEL, ACTIVITY_TYPE, STATUS_MSG } from '@/constants';
import { transactionService, activityService } from '@/services';

export const getTransactions = async (req, res) => {
  try {
    const { filterBy, cursor } = req.query;
    const result = await transactionService.loadTransactions(filterBy, cursor);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await transactionService.getOne(id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { input } = req.body;
    const result = await transactionService.createTransaction(input);
    //TODO Send Email to customer
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

export const updateTransaction = async (req, res) => {
  try {
    const { assignee, status } = req.body;
    const { id } = req.params;
    const result = await transactionService.updateTransaction(id, assignee.id, status);
    //TODO Send Email to customer
    //TODO Activity
    const activityToSave = {
      userId: assignee.id,
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

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await transactionService.deleteTransaction(id);
    const activityToSave = {
      userId: req.user.id,
      victimId: Number(id),
      model: ACTIVITY_MODEL.AWARD,
      type: ACTIVITY_TYPE.DELETE,
      metadata: { ...req.params, status: STATUS_MSG.SUCCEED }
    };
    await activityService.createActivity(activityToSave);
    res.status(200).json(result);
  } catch (e) {
    const activityToSave = {
      userId: req.user.id,
      model: ACTIVITY_MODEL.AWARD,
      type: ACTIVITY_TYPE.DELETE,
      metadata: {
        ...req.body,
        status: STATUS_MSG.FAILED,
        error: e.message,
        function: 'deleteTransaction'
      }
    };
    await activityService.createActivity(activityToSave);
    res.status(500).json(e.message);
  }
};
