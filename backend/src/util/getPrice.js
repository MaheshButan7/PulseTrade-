const axios = require('axios');

const priceCache = {} ;
const getPrice = async(symbol)=>{
try{
const map = {
    BTC:"bitcoin",
    ETH:"ethereum",
    SOL:"solana"
};
const id = map[symbol];
console.log("Symbol:", symbol);
console.log("Mapped ID:", id);

const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`)
console.log("API Response:", response.data);
const price = response.data[id].usd ;
priceCache[symbol] = price ;
return price ; 
}
catch(err){
    console.error("price fetch error" , err.message)
    if(priceCache[symbol]){
        return priceCache[symbol];
    }
    throw new Error("Failed to fetch price");
}
}
module.exports = getPrice ;