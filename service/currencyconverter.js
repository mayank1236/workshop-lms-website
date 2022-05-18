const axios = require('axios').default;

async function currencyConvTR(amount,fromCurr,toCurr)
{
  var apiKey = '2bdb3a74d7e34981b46dddda8e1d9563';

            
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

module.exports = {currencyConvTR};