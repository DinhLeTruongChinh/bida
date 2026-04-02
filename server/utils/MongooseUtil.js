// CLI : npm install mongoose --save
const mongoose = require ('mongoose') ;
const MyConstants = require ('./MyConstants') ;
const uri = 'mongodb+srv://' + MyConstants.DB_USER + ':' + MyConstants.DB_PASS + '@' +
MyConstants.DB_SERVER + '/' + MyConstants.DB_DATABASE ;
//const uri='mongodb+srv://dinhletruongchinh:Bom1225$@banhang.u2sdcgw.mongodb.net/shoppingonline';
mongoose.connect ( uri)
. then (() => { console . log ('Connected to ' + MyConstants.DB_SERVER + '/' + MyConstants.DB_DATABASE ) ; })
. catch (( err ) => { console.error ( err ) ; }) ;