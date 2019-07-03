class Utilities{
    /**
     * Updates the rapport value of all contacts so that reminders can be sent.
     * @param db: Pointer to the database.
     * @param contacts: Array of emails of contacts whose rapports needs to be updated.
     * @returns: nothing
     */
    UpdateContacts(contacts, db){
       contacts.forEach((email) => {
           // Gets a list of interactions the contact is a part of.
           db.collection('interactions').find({ members: email }).sort({endTime: -1}).toArray().then( interactions => {//.sort({endTime: -1})

               // Sum the interaction qualities together.
                var newRapport = 0;
                interactions.forEach((interaction) => {
                    // The Time value is the number of 10 min. increments the meeting was held for.
                    var timeValue = (new Date(interaction.endTime) - new Date (interaction.startTime)) / (1000 * 60 * 12)
                    // The time value is then multiplied by the given quality after getting the natural log of it.
                    newRapport += interaction.eventQualtity * Math.log(timeValue); // TODO: figure out how to get the time in here.
                })
                // Get the average rapport
                newRapport = newRapport / interactions.length

                // Get the most recent interaction.
                var recentInteractionDate = new Date(interactions[0].endTime)
                var timePenalty = (new Date() - new Date (recentInteractionDate))/ (1000 * 60 * 60 * 24)
                //Decrement the Rapport based on how long it has been since an interaction.
                var newRapport = Math.floor(newRapport - timePenalty);

                // Get the contact, so we can update the rapport.
                var contact = db.collection('contacts').find({ email: email }).limit(1).next().then( contact => {
                    // Update the Rapport.
                    contact.rapport = newRapport

                    db.collection('contacts').updateOne({email: email}, { $set: contact })
                    .catch(error => {
                      // Log the error.
                      console.log(error)
                    })
                })
           })
       })
    }



  //Once Emails are triggered to be sent use:  Utilities.SendEmail(email);

  SendEmail(contact) {
    // async..await is not allowed in global scope, must use a wrapper
    async function main() {

      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        //host: "smtp.ethereal.email",
        host: "smtp.office365.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        ///port: 465,
        //secure: true,
        //proxy: 'http://proxy.fnfis:8080',
        auth: {
          //user: testAccount.user, // generated ethereal user
          //pass: testAccount.pass // generated ethereal password
          user: "matthew.schubring@fisglobal.com",
          pass: password
        }
      });

      // setup e-mail data with unicode symbols
      var mailOptions = {
        from: '"FIS_Connected 👻" <connected@fisglobal.com>', // sender address
        to: `${contact}, baz@example.com`, // list of receivers
        subject: "FIS_Connected ✔", // Subject line
        text: "Connect with your contact Tom Petty!", // plain text body
        html: "<b>Connect with your contact Tom Petty!</b>" // html body
      };

      // send mail with defined transport object
      let info = await transporter.sendMail(mailOptions);


      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    main().catch(console.error);

  }
}

module.exports = {
  Utilities: Utilities
}


let dummy = new Utilities()
dummy.SendEmail(contact)
