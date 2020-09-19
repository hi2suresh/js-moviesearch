
const input = document.querySelector('input');

const fetchData = async(searchTerm) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params : {
            apikey: '56ca05c8',
            s: searchTerm
        }
    });
    console.log(response.data);
}


const onInput = event => {
    fetchData(event.target.value);
}


input.addEventListener('input', debounce(onInput));

