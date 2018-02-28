const model = require('../database/model');

let Orders = model.Orders;

let findOneByOrderNum = async(orderNum) => {
  let order = await Orders.findOne({
    where: {
      orderNum
    }
  });
  return order;
}

let findOneById = async(id) => {
  let order = await Orders.findOne({
    where: {
      id: id
    }
  });
  return order;
}

let createOrder = async(orderObj={}) => {
  const {
    uid,
    credits,
    appKey,
    description,
    orderNum,
    type,
    params,
    finished
  } = orderObj;
  finished = false
  let newOrder = await Orders.create({
    uid,
    credits,
    appKey,
    description,
    orderNum,
    type,
    params,
    finished
  });
  return newOrder;
}

let updateOrder = async(orderEntity) => {
  orderEntity.updatedAt = Date.now();
  orderEntity.version ++;
  return await Orders.save(orderEntity);
}

module.exports = {
  'findOneByOrderNum': findOneByOrderNum,
  'findOneById': findOneById,
  'createOrder': createOrder,
  'updateOrder': updateOrder
};
