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

const battlePage = (req, res) => {
 // Domo.DomoModel.findByOwner(req.session.account._id)/*.limit(6)*/.exec((erro, yTeam) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (erro, yTeamDocs) => {
    if (erro) {
      console.log(erro);
      return res.status(400).json({ error: 'An error occurred' });
    }

    let yTeam = yTeamDocs;
    if (yTeam.length > 6) {
      yTeam = yTeam.slice(0, 6);
    }

    return Domo.DomoModel.findRandom(
			{ owner: { $ne: req.session.account._id } })/* .limit(6)*/.exec((err, tTeamDocs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }

  let tTeam = tTeamDocs;
  if (tTeam.length > 6) {
    tTeam = tTeam.slice(0, 6);
  }

  const winner = Math.floor((Math.random() * 10) + 1);
	let text = '';

  if (winner > 5) {
		text = "You lost the battle!";
    for (let i = 0; i < tTeam.length; i++) {
      tTeam[i].update({}, { $set: { wins: tTeam[i].wins + 1 } });
    }
  } else {
		text = "You won the battle!";
    for (let i = 0; i < yTeam.length; i++) {
      yTeam[i].update({}, { $set: { wins: yTeam[i].wins + 1 } });
    }
  }

			

  return res.render('battle', { csrfToken: req.csrfToken(), yTeam, tTeam, text });
});
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
    wins: req.body.age,
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

const addPoke = (req, res) => {
  if (!req.body.nameP) {
    return res.status(400).json({ error: 'Whats your name again?' });
  }

  return Domo.DomoModel.findOne({ name: req.body.nameP }, (erro, result) => {
    if (erro) {
      return res.status(400).json({ error: 'That pokemon is not in my pokedex' });
    }

    if (result == null) {
      return res.status(400).json({ error: 'Is that a Pokemon?' });
    }
    const domoData = {
      name: result.name,
      wins: 0,
      path: result.path,
      owner: req.session.account._id,
    };

    const newDomo = new Domo.DomoModel(domoData);

    return newDomo.save((error) => {
      if (error) {
        console.log(error);
        return res.status(400).json({ error: 'An error occurred' });
      }
      return res.json({ redirect: '/maker' });
    });
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

module.exports.addPoke = addPoke;
module.exports.makerPage = makerPage;
module.exports.worldPage = worldPage;
module.exports.battlePage = battlePage;
module.exports.make = makeDomo;
module.exports.makeChild = makeChildDomo;
