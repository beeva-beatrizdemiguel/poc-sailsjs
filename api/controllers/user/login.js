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

    var userRecord = await User.findOne({
      name: inputs.name.toLowerCase(),
    });

    // If there was no matching user, respond thru the "badCombo" exit.
    if(!userRecord) {
      throw 'badCombo';
    }

    // If the password doesn't match, then also exit thru "badCombo".
    await sails.helpers.passwords.checkPassword(inputs.password, userRecord.password)
    .intercept('incorrect', 'badCombo');

    // Modify the active session instance.
    this.req.session.userId = userRecord.id;

    // Send success response (this is where the session actually gets persisted)
    return exits.success();
  }


};
