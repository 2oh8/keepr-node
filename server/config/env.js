// LOCAL DEV VARIABLES
let env = {
	NODE_ENV: 'development',
	PORT: process.env.PORT || 3000,
	DBPROTOCOL: 'mongodb',
	DBUSERNAME: 'keepr',
	DBPASSWORD: 'lavakeeps',
	DBHOST: 'ds163034.mlab.com:63034',
	DBNAME: 'keeprone',
	SERVERNAME: 'dev-server'
}

// MAPS env TO ACTUAL ENVIRONMENT
Object.keys(env).forEach(v => {
	process.env[v] = process.env[v] || env[v]
}) 


// MongoDb Connection String Builder
env.CONNECTIONSTRING = `${env.DBPROTOCOL}://${env.DBUSERNAME}:${env.DBPASSWORD}@${env.DBHOST}/${env.DBNAME}`
process.env.CONNECTIONSTRING = env.CONNECTIONSTRING

exports = env