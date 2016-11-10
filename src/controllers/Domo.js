const models = require('../models');

const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
  // res.render('app');
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  return newDomo.save((err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ redirect: '/maker' });
  });
};

const makeChildDomo = (req, res) => {
 // let foundName;

  if (!req.body.name) {
    return res.status(400).json({ error: 'RAWR! Who is my parent! >_<' });
  }

  Domo.DomoModel.findOneAndUpdate({ name: res.body.nameC }, { $set: { name: `${req.body.nameC} jr.` } }, { new: true }, (err, result) => {
    if (err) {
      return res.status(400).json({ error: 'RAWR! That Domo is not here!' });
    }
    const newDomo = new Domo.DomoModel(result);

    return newDomo.save((erro) => {
      if (erro) {
        console.log(erro);
        return res.status(400).json({ error: 'An error occurred' });
      }
      return res.json({ redirect: '/maker' });
    });
  });
  return res.json({ redirect: '/maker' });
};


module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.makeChild = makeChildDomo;
