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

const worldPage = (req, res) => {
  Domo.DomoModel.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('world', { csrfToken: req.csrfToken(), domos: docs });
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

  if (!req.body.nameC) {
    return res.status(400).json({ error: 'RAWR! Who is my parent! >_<' });
  }

  return Domo.DomoModel.findOneAndUpdate({ name: req.body.nameC }, { $set: { name: `${req.body.nameC} jr.`, age: 0 } }, { new: true }, (err, result) => {
    if (err) {
      return res.status(400).json({ error: 'RAWR! That Domo is not here!' });
    }
    const newDomo = new Domo.DomoModel(result);
    console.dir(newDomo);

    return newDomo.save((erro) => {
      if (erro) {
        console.log(erro);
        return res.status(400).json({ error: 'An error occurred. Please reinsert your NES cartridge' });
      }
      return res.json({ redirect: '/maker' });
    });
  });
  // return res.json({ redirect: '/maker' });
};


module.exports.makerPage = makerPage;
module.exports.worldPage = worldPage;
module.exports.make = makeDomo;
module.exports.makeChild = makeChildDomo;
