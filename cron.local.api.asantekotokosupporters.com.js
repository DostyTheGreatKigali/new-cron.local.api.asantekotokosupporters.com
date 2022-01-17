// Live TODOS:
// Enable SMS
// Enable CORS

// Dev TODOS:
// Revisit card-dues logic everywhere
// 'months' is ony for dues and card-dues, don't consider it for card and contributions
// Don't send SMS to foreign numbers
// There should be an auto/user/manual flags for cancelled mandate so that auto can be used 
// Resubscribe the user 

// Let a cron handle prove numbers instead of spinning a new process to prove on every ussd request


// CONSIDER ONLY when card is being paid
// Registration should have payment_type when id card payment is not free


const fastify = require('fastify')({
    logger: true,
    ignoreTrailingSlash: true,
    trustProxy: true
})

var fs = require('fs');
const { spawn } = require("child_process");
const { exec } = require("child_process");

// const axios = require('axios');
const qs = require('qs');
require('make-promises-safe')

const fsequelize = require('fastify-sequelize')
const { QueryTypes } = require('sequelize');

require('dotenv').config();
const devEnvFileName = '.env-asksup';

if (fs.existsSync(devEnvFileName)) {
    const dotenv = require('dotenv')
    const envConfig = dotenv.parse(fs.readFileSync(devEnvFileName))
    for (const k in envConfig) {
        process.env[k] = envConfig[k]
    }
}

const hostname = process.env.HOST;
const port = process.env.PORT;

const api_base_url = process.env.API_BASE_URL;
const main_api_base_url = process.env.MAIN_API_BASE_URL;

const CALLBACK_ABSOLUTE_BASE_PATH = process.env.CALLBACK_ABSOLUTE_BASE_PATH;
const CALLBACK_BASE_URL = process.env.CALLBACK_BASE_URL;

const DIRECT_DEBIT_MERCHANT_ID = process.env.DIRECT_DEBIT_MERCHANT_ID;
const DIRECT_DEBIT_API_KEY = process.env.DIRECT_DEBIT_API_KEY;
const DIRECT_DEBIT_PRODUCT_ID = process.env.DIRECT_DEBIT_PRODUCT_ID;
const DIRECT_DEBIT_BASE_URL = process.env.DIRECT_DEBIT_BASE_URL;

console.log('Host name ' + hostname);

const corsOptions = {
    origin: '*',//['https://manage.ghanafaapp.com', 'https://apidocs.asantekotokosupporters.com', 'http://localhost'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
fastify.register(require('fastify-cors'), //{ 
    corsOptions
    // put your options here
    //}
)


fastify.register(require('fastify-axios'))

fastify.get('/', async (request, reply) => {
    return { home: 'welcome home from ' + api_base_url }
})

fastify.get('/spawn', async (request, reply) => {
    // const ls = spawn("grep", ["-r", "'233549063668'", "/var/www/callback.asantekotokosupporters.com/storage/app/"]);
    // // grep -r '233549063668' /var/www/callback.asantekotokosupporters.com/storage/app/
    // ls.stdout.on("data", data => {
    // 	console.log('stdout');
    //     console.log(`stdout: ${data}`);
    // });

    // ls.stderr.on("data", data => {
    // 	console.log('stderr');
    //     console.log(`stderr: ${data}`);
    // });

    // ls.on('error', (error) => {
    // 	console.log('on error');
    //     console.log(`error: ${error.message}`);
    // });

    // ls.on("close", code => {
    //     console.log(`child process exited with code ${code}`);
    // });
    let fileDumpPath = CALLBACK_ABSOLUTE_BASE_PATH + "/public/autodebits/233549063668-abs-2.txt";
    let grepCommand = "grep -r '233549063668' " + CALLBACK_ABSOLUTE_BASE_PATH + "/storage/app/ > " + fileDumpPath;
    console.log(grepCommand);

    exec(grepCommand, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(fs.existsSync(fileDumpPath) ? 'File created' : 'File Not created')
    });
    return { home: 'welcome home from ' + api_base_url }
})


fastify.get('/spawn-number/:phone', async (request, reply) => {
    // const ls = spawn("grep", ["-r", "'233549063668'", "/var/www/callback.asantekotokosupporters.com/storage/app/"]);
    // // grep -r '233549063668' /var/www/callback.asantekotokosupporters.com/storage/app/
    // ls.stdout.on("data", data => {
    // 	console.log('stdout');
    //     console.log(`stdout: ${data}`);
    // });

    // ls.stderr.on("data", data => {
    // 	console.log('stderr');
    //     console.log(`stderr: ${data}`);
    // });

    // ls.on('error', (error) => {
    // 	console.log('on error');
    //     console.log(`error: ${error.message}`);
    // });

    // ls.on("close", code => {
    //     console.log(`child process exited with code ${code}`);
    // });
    let phone = request.params.phone;
    let fileDumpPath = CALLBACK_ABSOLUTE_BASE_PATH + "/public/autodebits/" + phone + ".txt";
    let grepCommand = "grep -r '" + phone + "' " + CALLBACK_ABSOLUTE_BASE_PATH + "/storage/app/ > " + fileDumpPath;
    console.log(grepCommand);

    exec(grepCommand, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(fs.existsSync(fileDumpPath) ? 'File created' : 'File Not created')
    });
    return { home: 'welcome home from ' + api_base_url }
})

fastify.get('/spawn/number/cancel/:phone', async (request, reply) => {
    // const ls = spawn("grep", ["-r", "'233549063668'", "/var/www/callback.asantekotokosupporters.com/storage/app/"]);
    // // grep -r '233549063668' /var/www/callback.asantekotokosupporters.com/storage/app/
    // ls.stdout.on("data", data => {
    // 	console.log('stdout');
    //     console.log(`stdout: ${data}`);
    // });

    // ls.stderr.on("data", data => {
    // 	console.log('stderr');
    //     console.log(`stderr: ${data}`);
    // });

    // ls.on('error', (error) => {
    // 	console.log('on error');
    //     console.log(`error: ${error.message}`);
    // });

    // ls.on("close", code => {
    //     console.log(`child process exited with code ${code}`);
    // });
    let phone = request.params.phone;
    let fileDumpPath = CALLBACK_ABSOLUTE_BASE_PATH + "/public/autodebits/" + phone + ".txt";
    let grepCommand = "grep -r '" + phone + "' " + CALLBACK_ABSOLUTE_BASE_PATH + "/storage/app/ > " + fileDumpPath;
    console.log(grepCommand);

    exec(grepCommand, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(fs.existsSync(fileDumpPath) ? 'File created' : 'File Not created')

        let spawnUrl = api_base_url + '/spawn/cancel/await/' + phone;
        fastify.axios.get(spawnUrl)
            .then(response => {
                console.log('SPAWN RESULTS ... IN /spawn-number/:phone');
                console.log(response.data);
                // return {success: true, text: 'received'};
            }).catch(err => {
                console.error(err);
            });
    });
    return { home: 'welcome home from ' + api_base_url }
})

fastify.get('/spawn/number/cancel/:phone/:exclude_mandate_id', async (request, reply) => {
    // const ls = spawn("grep", ["-r", "'233549063668'", "/var/www/callback.asantekotokosupporters.com/storage/app/"]);
    // // grep -r '233549063668' /var/www/callback.asantekotokosupporters.com/storage/app/
    // ls.stdout.on("data", data => {
    // 	console.log('stdout');
    //     console.log(`stdout: ${data}`);
    // });

    // ls.stderr.on("data", data => {
    // 	console.log('stderr');
    //     console.log(`stderr: ${data}`);
    // });

    // ls.on('error', (error) => {
    // 	console.log('on error');
    //     console.log(`error: ${error.message}`);
    // });

    // ls.on("close", code => {
    //     console.log(`child process exited with code ${code}`);
    // });

    let mandateId = request.params.exclude_mandate_id;
    let phone = request.params.phone;
    let fileDumpPath = CALLBACK_ABSOLUTE_BASE_PATH + "/public/autodebits/" + phone + ".txt";
    let grepCommand = "grep -r '" + phone + "' " + CALLBACK_ABSOLUTE_BASE_PATH + "/storage/app/ > " + fileDumpPath;
    console.log(grepCommand);

    exec(grepCommand, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(fs.existsSync(fileDumpPath) ? 'File created' : 'File Not created')

        // let spawnUrl = api_base_url + '/spawn/cancel/await/' + phone;
        let spawnUrl = api_base_url + '/spawn/cancel/await/' + phone + '/' + mandateId;

        fastify.axios.get(spawnUrl)
            .then(response => {
                console.log('SPAWN RESULTS ... IN /spawn-number/:phone');
                console.log(response.data);
                // return {success: true, text: 'received'};
            }).catch(err => {
                console.error(err);
            });
    });
    return { home: 'welcome home from ' + api_base_url }
})

fastify.get('/spawn/cancel/:phone', async (request, reply) => {

    let phone = request.params.phone
    // exec("grep -r '233549063668' /var/www/callback.asantekotokosupporters.com/storage/app/ > /var/www/callback.asantekotokosupporters.com/public/autodebits/233549063668-abs-2.txt", (error, stdout, stderr) => {
    //     if (error) {
    //         console.log(`error: ${error.message}`);
    //         return;
    //     }
    //     if (stderr) {
    //         console.log(`stderr: ${stderr}`);
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    // });
    var config = {
        headers: {
            'Content-Length': 0,
            'Content-Type': 'text/plain'
        },
        responseType: 'text'
    };

    // set the headers
    const postConfig = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    };

    var url = CALLBACK_BASE_URL + '/autodebits/' + phone + '.txt';
    // var response = await fetch(url);
    var postUrl = DIRECT_DEBIT_BASE_URL + '/mobiledebit/cancel/mandate';

    return fastify.axios.get(url, config)
        .then(queryResponseData => {
            console.log(typeof queryResponseData);
            // return {success: true, text: 'received'};
            let json = queryResponseData.data;
            console.log(typeof json);
            console.log(json);
            // return {success: true, text: 'received'};
            // return {success: true, text: json};

            let replaced = json.replace(/[\n\r]/g, ',');
            let arrReplaced = replaced.split('},');
            // let arrReplaced = replaced.split(/live.*json:/, 5000);

            let finalArray = [];
            for (let a = 0; a < arrReplaced.length; a++) {

                let currentString = arrReplaced[a];
                if (currentString.length < 10) {
                    continue;
                }
                // currentString = currentString.replace(/live.*json:/, '');
                currentString = currentString.replace(/\/var.*json:/, '');
                currentString = currentString + '}';
                // console.log('current string is '+ currentString);
                finalArray.push(JSON.parse(currentString));
                // finalArray.push(currentString);
                // break;
            }
            let counter = 0;
            // return finalArray;
            finalArray.forEach((item) => {
                if (!item.hasOwnProperty('clientPhone') || !item.hasOwnProperty('merchantId')) {
                    return false; // in await for each we DON'T USE continue
                }
                console.log('Item print out ');
                console.log(item);

                let postData = {
                    "merchantId": DIRECT_DEBIT_MERCHANT_ID,
                    "productId": DIRECT_DEBIT_PRODUCT_ID,
                    "clientPhone": item.clientPhone,
                    "mandateId": item.mandateId,
                    "apiKey": DIRECT_DEBIT_API_KEY
                }
                fastify.axios.post(postUrl, postData, postConfig)
                    .then(response => {
                        console.log(item);
                        console.log('MANDATE CANCELLATION RESPONSE ...' + counter);
                        console.log(response.data);


                        // return {success: true, text: 'received'};
                    }).catch(err => {
                        console.error(err);
                    });
                console.log('Counter to increase ' + counter);
                counter++;
            })
            // console.log(queryResponseData.data);
            // let queryData = queryResponseData.data;
            //           return fastify.axios.get(postUrl)
            //             .then(response => {
            //               // console.log(response.data);


            // return {success: true, text: 'received'};
            //             }).catch(err => {
            //               console.error(err);
            //             });
            //           ;
            return finalArray;

        }).catch(err => {
            console.error(err);
        });

    return { home: 'welcome home from ' + api_base_url }
})


fastify.get('/spawn/cancel/await/:phone', async (request, reply) => {

    let phone = request.params.phone
    // exec("grep -r '233549063668' /var/www/callback.asantekotokosupporters.com/storage/app/ > /var/www/callback.asantekotokosupporters.com/public/autodebits/233549063668-abs-2.txt", (error, stdout, stderr) => {
    //     if (error) {
    //         console.log(`error: ${error.message}`);
    //         return;
    //     }
    //     if (stderr) {
    //         console.log(`stderr: ${stderr}`);
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    // });
    var config = {
        headers: {
            'Content-Length': 0,
            'Content-Type': 'text/plain'
        },
        responseType: 'text'
    };

    // set the headers
    const postConfig = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    };

    var url = CALLBACK_BASE_URL + '/autodebits/' + phone + '.txt';
    // var response = await fetch(url);
    var postUrl = DIRECT_DEBIT_BASE_URL + '/mobiledebit/cancel/mandate';
    try {
        const { data: json, status: jsonStatus } = await fastify.axios.get(url, config);

        console.log(typeof json);
        console.log(json);
        // return {success: true, text: 'received'};
        // return {success: true, text: json};

        let replaced = json.replace(/[\n\r]/g, ',');
        let arrReplaced = replaced.split('},');
        // let arrReplaced = replaced.split(/live.*json:/, 5000);

        let finalArray = [];
        for (let a = 0; a < arrReplaced.length; a++) {

            let currentString = arrReplaced[a];
            if (currentString.length < 10) {
                continue;
            }
            // currentString = currentString.replace(/live.*json:/, '');
            currentString = currentString.replace(/\/var.*json:/, '');
            currentString = currentString + '}';
            // console.log('current string is '+ currentString);
            finalArray.push(JSON.parse(currentString));
            // finalArray.push(currentString);
            // break;
        }

        sendCancelRequests(finalArray);


    } catch (err) {

        console.log(err)

    }


    return { home: 'welcome home from ' + api_base_url }
})


fastify.get('/spawn/cancel/await/:phone/:exclude_mandate_id', async (request, reply) => {

    let phone = request.params.phone
    let mandateId = request.params.exclude_mandate_id;

    // exec("grep -r '233549063668' /var/www/callback.asantekotokosupporters.com/storage/app/ > /var/www/callback.asantekotokosupporters.com/public/autodebits/233549063668-abs-2.txt", (error, stdout, stderr) => {
    //     if (error) {
    //         console.log(`error: ${error.message}`);
    //         return;
    //     }
    //     if (stderr) {
    //         console.log(`stderr: ${stderr}`);
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    // });
    var config = {
        headers: {
            'Content-Length': 0,
            'Content-Type': 'text/plain'
        },
        responseType: 'text'
    };

    // set the headers
    const postConfig = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    };

    var url = CALLBACK_BASE_URL + '/autodebits/' + phone + '.txt';
    // var response = await fetch(url);
    var postUrl = DIRECT_DEBIT_BASE_URL + '/mobiledebit/cancel/mandate';
    try {
        const { data: json, status: jsonStatus } = await fastify.axios.get(url, config);

        console.log(typeof json);
        console.log(json);
        // return {success: true, text: 'received'};
        // return {success: true, text: json};

        let replaced = json.replace(/[\n\r]/g, ',');
        let arrReplaced = replaced.split('},');
        // let arrReplaced = replaced.split(/live.*json:/, 5000);

        let finalArray = [];
        for (let a = 0; a < arrReplaced.length; a++) {

            let currentString = arrReplaced[a];
            if (currentString.length < 10) {
                continue;
            }
            // currentString = currentString.replace(/live.*json:/, '');
            currentString = currentString.replace(/\/var.*json:/, '');
            currentString = currentString + '}';
            // console.log('current string is '+ currentString);
            finalArray.push(JSON.parse(currentString));
            // finalArray.push(currentString);
            // break;
        }

        sendCancelRequestsExcludeMandateId(finalArray, mandateId);


    } catch (err) {

        console.log(err)

    }


    return { home: 'welcome home from ' + api_base_url }
})

fastify.get('/spawn-test', async (request, reply) => {

    // exec("grep -r '233549063668' /var/www/callback.asantekotokosupporters.com/storage/app/ > /var/www/callback.asantekotokosupporters.com/public/autodebits/233549063668-abs-2.txt", (error, stdout, stderr) => {
    //     if (error) {
    //         console.log(`error: ${error.message}`);
    //         return;
    //     }
    //     if (stderr) {
    //         console.log(`stderr: ${stderr}`);
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    // });
    var config = {
        headers: {
            'Content-Length': 0,
            'Content-Type': 'text/plain'
        },
        responseType: 'text'
    };

    // set the headers
    const postConfig = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    };

    var url = CALLBACK_BASE_URL + '/autodebits/233549063668.txt';
    // var response = await fetch(url);
    var postUrl = DIRECT_DEBIT_BASE_URL + '/mobiledebit/cancel/mandate';

    return fastify.axios.get(url, config)
        .then(queryResponseData => {
            console.log(typeof queryResponseData);
            // return {success: true, text: 'received'};
            let json = queryResponseData.data;
            console.log(typeof json);
            console.log(json);
            // return {success: true, text: 'received'};
            // return {success: true, text: json};

            let replaced = json.replace(/[\n\r]/g, ',');
            let arrReplaced = replaced.split('},');
            // let arrReplaced = replaced.split(/live.*json:/, 5000);

            let finalArray = [];
            for (let a = 0; a < arrReplaced.length; a++) {

                let currentString = arrReplaced[a];
                if (currentString.length < 10) {
                    continue;
                }
                // currentString = currentString.replace(/live.*json:/, '');
                currentString = currentString.replace(/\/var.*json:/, '');
                currentString = currentString + '}';
                // console.log('current string is '+ currentString);
                finalArray.push(JSON.parse(currentString));
                // finalArray.push(currentString);
                // break;
            }
            let counter = 0;
            // return finalArray;
            finalArray.forEach((item) => {
                if (!item.hasOwnProperty('clientPhone') || !item.hasOwnProperty('merchantId')) {
                    return false; // in await for each we DON'T USE continue
                }
                console.log('Item print out ');
                console.log(item);

                let postData = {
                    "merchantId": DIRECT_DEBIT_MERCHANT_ID,
                    "productId": DIRECT_DEBIT_PRODUCT_ID,
                    "clientPhone": item.clientPhone,
                    "mandateId": item.mandateId,
                    "apiKey": DIRECT_DEBIT_API_KEY
                }
                fastify.axios.post(postUrl, postData, postConfig)
                    .then(response => {
                        console.log(item);
                        console.log('MANDATE CANCELLATION RESPONSE ...' + counter);
                        console.log(response.data);


                        // return {success: true, text: 'received'};
                    }).catch(err => {
                        console.error(err);
                    });
                console.log('Counter to increase ' + counter);
                counter++;
            })
            // console.log(queryResponseData.data);
            // let queryData = queryResponseData.data;
            //           return fastify.axios.get(postUrl)
            //             .then(response => {
            //               // console.log(response.data);


            // return {success: true, text: 'received'};
            //             }).catch(err => {
            //               console.error(err);
            //             });
            //           ;
            return finalArray;

        }).catch(err => {
            console.error(err);
        });

    return { home: 'welcome home from ' + api_base_url }
})


const start = async () => {
    try {
        await fastify.listen(port)
        // fastify.swagger()
        fastify.log.info(`listening on ${fastify.server.address().port}`)
        console.log('started .....')
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()

fastify.ready().then(() => {
    console.log('successfully booted!')

    // checkAndUpdateTransactions();


}, (err) => {
    console.log('an error happened', err)
})


const checkAndUpdateTransactions = async function () {
    // Self contained cron to run every minute

    try {
        setInterval(async () => {
            try {
                console.log("checkAndUpdateTransactions running ...")
                console.log(main_api_base_url + '/api/v1/query-temp-transactions');
                const { data, status } = await fastify.axios.get(main_api_base_url + '/api/v1/query-temp-transactions')
                console.log(data);
            } catch (err) {

                console.log(err)

            }

        }, 1000 * 60 * 1); // 5 minute
    } catch (error) {
        console.error(error);
    }
}

async function sendCancelRequests(finalArray) {
    // set the headers
    const postConfig = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    };

    // var response = await fetch(url);
    var postUrl = DIRECT_DEBIT_BASE_URL + '/mobiledebit/cancel/mandate';
    await asyncForEach(finalArray, async (item) => {
        if (!item.hasOwnProperty('clientPhone') || !item.hasOwnProperty('mandateId')) {
            return false; // in await for each we DON'T USE continue
        }
        console.log('Item print out ');
        console.log(item);

        let postData = {
            "merchantId": DIRECT_DEBIT_MERCHANT_ID,
            "productId": DIRECT_DEBIT_PRODUCT_ID,
            "clientPhone": item.clientPhone,
            "mandateId": item.mandateId,
            "apiKey": DIRECT_DEBIT_API_KEY
        }
        try {
            const { data: jsonPostData, status: jsonPostStatus } = await fastify.axios.post(postUrl, postData, postConfig);
            console.log(jsonPostData);
        } catch (err) {

            console.log(err)

        }


    })
}

async function sendCancelRequestsExcludeMandateId(finalArray, mandateId) {
    // set the headers
    const postConfig = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    };

    // var response = await fetch(url);
    var postUrl = DIRECT_DEBIT_BASE_URL + '/mobiledebit/cancel/mandate';

    await asyncForEach(finalArray, async (item) => {

        // console.log("Item For Checking 3rd Party Transaction's KEY")
        // console.log(item)

        if (!item.hasOwnProperty('clientPhone') || !item.hasOwnProperty('mandateId')) {
            return false; // in await for each we DON'T USE continue
        }

        // CANCELLING ALL MANDATES EXCEPT RECENTLY SUCCESSFULLY CREATED ONE   
        if (item.mandateId == mandateId) {
            return false;
        }

        var getConfig = {
            headers: {
                'Content-Length': 0,
                'Content-Type': 'text/plain'
            },
            responseType: 'text'
        };

        // If 3rd Party Reference is already "Cancelled", do return
        var getUrl = DIRECT_DEBIT_BASE_URL + '/mobiledebit/mandate/status/' + item.thirdPartyReferenceNo;

        // fastify.axios.get(getUrl)
        //     .then(response => {
        //         console.log("logging response data after hitting mandate status route")
        //         console.log(response.data);
        //         if (response.data.status == 'Cancelled') {
        //             return;
        //         }

        //         // return {success: true, text: 'received'};
        //     })
        //     .catch(err => {
        //         console.error(err);
        //     });

        console.log('Item print out ');
        console.log(item);

        let postData = {
            "merchantId": DIRECT_DEBIT_MERCHANT_ID,
            "productId": DIRECT_DEBIT_PRODUCT_ID,
            "clientPhone": item.clientPhone,
            "mandateId": item.mandateId,
            "apiKey": DIRECT_DEBIT_API_KEY
        }
        try {
            const { data: jsonGetData, status: jsonGetStatus } = await fastify.axios.get(getUrl);
            console.log(jsonGetData);

            if (jsonGetData.status !== 'Cancelled') {
                const { data: jsonPostData, status: jsonPostStatus } = await fastify.axios.post(postUrl, postData, postConfig);
                console.log(jsonPostData);
            } else {
                console.log('STATUS IS CANCELLED SO SKIPPED')
            }
        } catch (err) {

            console.log(err)

        }


    })
}




async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
