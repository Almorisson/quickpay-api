const docs = {
    "customers": {
        "/api/v1/customers/docs": "api docs for customers",
        "/api/v1/customers/": "get all customers route",
        "/api/v1/customers/register": "register route",
        "/api/v1/customers/login": "login route",
        "/api/v1/customers/logout": "logout route",
        "/api/v1/customers/:traderId": "get/update/delete trader route"
    },

    "traders": {
        "/api/v1/traders/docs": "api docs for traders",
        "/api/v1/traders/": "get all traders route",
        "/api/v1/traders/register": "register route",
        "/api/v1/traders/login": "login route",
        "/api/v1/traders/logout": "logout route",
        "/api/v1/traders/:traderId": "get/update/delete trader route"
    },

    "transactions": {
        "/api/v1/transactions/docs": "api docs for transactions",
        "/api/v1/transactions/": "get all transactions route",
        "/api/v1/transactions/createAmountToPay/:traderId": "createAmountToPay route",
        "/api/v1/transactions/findLastAmount/:traderId": "findLastAmount route"
    }
}

module.exports = docs
