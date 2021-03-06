const axios = require('axios')

exports.post = (req, res) => {
    var result = req.body;
    var email = result.form_response.answers[0].email;
    var referralCode = result.form_response.hidden.referral == '' ? result.form_response.hidden.usercode : result.form_response.hidden.referral;
    var resultsUrl;
    var internalId = result.event_id;
  
    var data = {
      "apiToken":"VIRAL_LOOPS_CAMPAIGN_API_TOKEN",
      "params":{
          "event":"registration",
          "user":{
              "firstname": "",
              "lastname": "",
              "email": email,
              "extraData": { "internalID": internalId }
          },
          "referrer":{
              "referralCode": referralCode,
          },
          "refSource": ""
      }
  }
  
  axios
    .post('https://app.viral-loops.com/api/v2/events', 
      data, {
        headers: {  'Content-Type': 'application/json',
}
      })    
    .then(res => {
      console.log(res)
    })
    .catch(error => {
      console.error(error)
    }).then(    res.status(200).end()
    )
    };
  
exports.get = (req, res) => {
      var email = req.query.email;
      console.log(email);
      var referralCode;
      var data = {
        "apiToken":"VIRAL_LOOPS_CAMPAIGN_API_TOKEN",
        "params": {
          "participants": [{
            "email": email
          }],
        },
        "filter": {
          "limit": 50,
          "skip": 0
         }
    }
    
    axios
      .get('https://app.viral-loops.com/api/v2/participant_data', 
         {
          headers: {  'Content-Type': 'application/json',
        },
          params: data,
        })
      .then(res => {
        referralCode = res?.data?.data[0]?.user?.referralCode;
        resultsUrl = referralCode != null ? 'TYPEFORM_RESULTS_URL?userCode='+referralCode : 'TYPEFORM_RESULTS_URL';
      })
      .catch(error => {
        console.error(error)
      }).then(      async () => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
        await res.redirect(resultsUrl);
      }
      )
      referralCode = ''
      resultsUrl = '';

      };