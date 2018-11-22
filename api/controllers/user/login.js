module.exports = {


  friendlyName: 'Login',


  description: 'Login user.',


  inputs: {

    name: {
      description: 'Username',
      type: 'string',
      required: true
    },

    password: {
      description: 'Unencrypted password',
      type: 'string',
      required: true
    },
  },

  exits: {

    success: {
      responseType: ''
    },

    badRequest: {
      description: '',
      responseType: 'badRequest'
    }

  },


  fn: async function (inputs, exits) {
    const user = await User.findOne({ name: inputs.name }).decrypt();

    if(!user) {
      return exits.badRequest();
    }

    await sails.helpers.passwords.checkPassword(inputs.password, user.password).intercept('incorrect', 'badRequest');

    this.req.session.userId = user.id;

    return exits.success('Log in OK');

  }


};
