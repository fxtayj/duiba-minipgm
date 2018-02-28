const model = require('../database/model');

let Users = model.Users;

let findOneByUid = async(uid) => {
  let user = await Users.findOne({
    where: {
      uid
    }
  });
  return user;
}

let findOneById = async(id) => {
  let user = await Users.findOne({
    where: {
      id: id
    }
  });
  return user;
}

let createUser = async(userObj={}) => {
  const {
    uid,
    credits,
    nickName,
    gender
  } = userObj;
  let newUser = await Users.create({
    uid,
    credits,
    nickName,
    gender
  });
  return newUser;
}

let updateUser = async(user) => {
  user.updatedAt = Date.now();
  user.version ++;
  await user.save()
}

module.exports = {
  'findOneByUid': findOneByUid,
  'findOneById': findOneById,
  'createUser': createUser,
  'updateUser': updateUser
};
