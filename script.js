// script.js
let isUSDTtoOther = true; // Flag to track the conversion direction

function convert() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    const apiEndpoint = isUSDTtoOther ?
        `https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=${toCurrency}` :
        `https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=${fromCurrency}`;

    fetch(apiEndpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const rate = isUSDTtoOther ? data.tether[toCurrency.toLowerCase()] : data.tether[fromCurrency.toLowerCase()];

            if (typeof rate === 'number' && isFinite(rate)) {
                const convertedAmount = isUSDTtoOther ? amount * rate : amount / rate;
                document.getElementById('result').innerText = `Converted amount: ${convertedAmount.toFixed(2)} ${isUSDTtoOther ? toCurrency : fromCurrency}`;
                // Track conversion with Google Analytics
                trackConversion(convertedAmount, isUSDTtoOther ? toCurrency : fromCurrency);
            } else {
                throw new Error('Invalid exchange rate received');
            }
        })
        .catch(error => {
            console.error('Error fetching conversion rate:', error);
            document.getElementById('result').innerText = 'Error fetching conversion rate. Please try again later.';
        });
}

function toggleDirection() {
    isUSDTtoOther = !isUSDTtoOther;
    document.getElementById('fromCurrency').selectedIndex = 0;
    document.getElementById('toCurrency').selectedIndex = 0;
}

function trackConversion(amount, currency) {
    gtag('event', 'conversion', {
        'send_to': 'G-Z94VXPK0LE', // Your Google Analytics ID
        'value': amount,
        'currency': currency
    });
}
