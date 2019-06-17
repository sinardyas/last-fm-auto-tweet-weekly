module.exports = {
    stringBuilder: (data = []) => {
        let parsedString = 'Seminggu ini saya mendengarkan ';
        data.forEach(string => parsedString += `${string.title}, `);
        return parsedString;
    } 
};