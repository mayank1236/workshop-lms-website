const axios = require('axios').default;

async function currencyConvTR(amount,fromCurr,toCurr)
{
  var apiKey = '985d62ad0f7a4bdaa4184392d5972652';

            
            var queryy = fromCurr + '_' + toCurr;
            console.log(queryy)

            var url = 'https://api.currconv.com/api/v7/convert?q='
                      + queryy + '&compact=ultra&apiKey=' + apiKey;
            var resu =  await axios.get(url)
            // var jsonObj = JSON.parse(resu.data);
            // console.log(resu.data)


            

            var val = resu.data[queryy];
            // console.log(val)

            var total = val * amount;

            return Number(total.toFixed(2)) 
}

async function currencyFetch(fromCurr,toCurr)
{
  var apiKey = '985d62ad0f7a4bdaa4184392d5972652';

            
            var queryy = fromCurr + '_' + toCurr;
            console.log(queryy)

            var url = 'https://api.currconv.com/api/v7/convert?q='
                      + queryy + '&compact=ultra&apiKey=' + apiKey;
            var resu =  await axios.get(url)
            // var jsonObj = JSON.parse(resu.data);
            // console.log(resu.data)


            

            var val = resu.data[queryy];
            // console.log(val)

            // var total = val * amount;

            // return Number(val.toFixed(3)) 
            
            return Number(val) 
}

module.exports = {currencyConvTR,currencyFetch};