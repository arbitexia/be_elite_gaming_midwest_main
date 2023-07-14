import { ACTIVITY_MODEL, ACTIVITY_TYPE, STATUS_MSG } from '@/constants';
import { transactionService, activityService, emailService } from '@/services';

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
  const { input } = req.body;
  try {
    const result = await transactionService.createTransaction(input);
    //TODO Send Email to customer
    await emailService.requestTransactionEmail({
      user: result.user,
      transaction: result
    });
    //TODO Activity
    const activityToSave = {
      userId: req.user.id,
      victimId: result.id,
      model: ACTIVITY_MODEL.TRANSACTION,
      type: ACTIVITY_TYPE.REQUEST,
      metadata: { body: req.body, status: STATUS_MSG.SUCCEED }
    };
    await activityService.createActivity(activityToSave);
    res.status(200).json(result);
  } catch (e) {
    const activityToSave = {
      userId: input.userId,
      model: ACTIVITY_MODEL.TRANSACTION,
      type: ACTIVITY_TYPE.REQUEST,
      metadata: {
        body: req.body,
        status: STATUS_MSG.FAILED,
        error: e.message,
        function: 'createTransaction'
      }
    };
    await activityService.createActivity(activityToSave);
    res.status(500).json(e.message);
  }
};

export const updateTransaction = async (req, res) => {
  const { assignee, status } = req.body;
  const { id } = req.params;
  try {
    const result = await transactionService.updateTransaction(id, assignee.id, status);
    //TODO Send Email to customer
    if (status === 'ACCEPTED') {
      await emailService.acceptTransactionEmail({
        user: result.user,
        transaction: result
      });
    } else {
      await emailService.declineTransactionEmail({
        user: result.user,
        transaction: result
      });
    }

    //TODO Activity
    const activityToSave = {
      userId: assignee.id,
      victimId: result.id,
      model: ACTIVITY_MODEL.TRANSACTION,
      type: status === 'ACCEPTED' ? ACTIVITY_TYPE.ACCEPT : ACTIVITY_TYPE.DECLINE,
      metadata: { body: req.body, status: STATUS_MSG.SUCCEED }
    };
    await activityService.createActivity(activityToSave);
    res.status(200).json(result);
  } catch (e) {
    const activityToSave = {
      userId: assignee.id,
      model: ACTIVITY_MODEL.TRANSACTION,
      type: status === 'ACCEPTED' ? ACTIVITY_TYPE.ACCEPT : ACTIVITY_TYPE.DECLINE,
      metadata: {
        body: req.body,
        status: STATUS_MSG.FAILED,
        error: e.message,
        function: 'updateTransaction'
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
      model: ACTIVITY_MODEL.TRANSACTION,
      type: ACTIVITY_TYPE.DELETE,
      metadata: { body: req.params, status: STATUS_MSG.SUCCEED }
    };
    await activityService.createActivity(activityToSave);
    res.status(200).json(result);
  } catch (e) {
    const activityToSave = {
      userId: req.user.id,
      model: ACTIVITY_MODEL.TRANSACTION,
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

export const requestCouponTransaction = async (req, res) => {
  const { input } = req.body;
  try {
    const { result, message } = await transactionService.requestCoupon(input);
    //TODO Send Email to customer
    await emailService.requestTransactionEmail({
      user: result.user,
      transaction: result
    });
    //TODO Activity
    const activityToSave = {
      userId: result.userId,
      victimId: result.id,
      model: ACTIVITY_MODEL.TRANSACTION,
      type: ACTIVITY_TYPE.REQUEST,
      metadata: { body: input, status: STATUS_MSG.SUCCEED }
    };
    await activityService.createActivity(activityToSave);
    res.status(200).json({ message });
  } catch (e) {
    const activityToSave = {
      userId: input.userId,
      model: ACTIVITY_MODEL.TRANSACTION,
      type: ACTIVITY_TYPE.REQUEST,
      metadata: {
        body: input,
        status: STATUS_MSG.FAILED,
        error: e.message,
        function: 'requestCouponTransaction'
      }
    };
    await activityService.createActivity(activityToSave);
    res.status(500).json(e.message);
  }
};
