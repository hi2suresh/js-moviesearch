const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
 
     return `
             <img src="${imgSrc}" />
             ${movie.Title} (${movie.Year})
             `;
    },    
    inputValue(movie){
      return movie.Title;
    },
    async fetchData ( searchTerm ) {
     const response = await axios.get('http://www.omdbapi.com/', {
       params: {
         apikey: 'd9835cc5',
         s: searchTerm
       }
     });
   
     if (response.data.Error) {
       return [];
     }
   
     return response.data.Search;
   }
}
  
 createAutoComplete({
   root: document.querySelector('#left-autocomplete'),
   onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  },
   ...autoCompleteConfig   
 });

 createAutoComplete({
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  },
  ...autoCompleteConfig   
});

let leftMovie;
let rightMovie;
  const onMovieSelect = async (movie, summary, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: 'd9835cc5',
        i: movie.imdbID
      }
    });
    summary.innerHTML = movieTemplate(response.data);
    console.log(response.data);
    if(side === 'left'){
      leftMovie = response.data;
    } else {
      rightMovie = response.data;
    }

    if(leftMovie && rightMovie){
      runComparision();
    }
  }

  const runComparision = () => {
    const leftStats = document.querySelectorAll('#left-summary .notification');
    const rightStats = document.querySelectorAll('#right-summary .notification');

    leftStats.forEach((leftStat,index) => {
      const rightStat = rightStats[index];
      const leftValue = parseInt(leftStat.dataset.value);
      const rightValue = parseInt(rightStat.dataset.value);

      if(isNaN(rightValue)) {
        rightStat.classList.remove('is-primary');
        leftStat.classList.remove('is-primary');

      } else {

      if(rightValue > leftValue) {
        leftStat.classList.remove('is-primary');
        leftStat.classList.add('is-warning');
      } else {
        rightStat.classList.remove('is-primary');
        rightStat.classList.add('is-warning');
      }
    }

    })

  }

  const movieTemplate = (movieDetail) => {
    const dollars = parseInt(
      movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,'')
    );
    const metaScore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''));
    let count = 0;
    const awards = movieDetail.Awards.split(' ').reduce((prev,element) => {
      let value = parseInt(element);
      if(isNaN(value)) {
        return prev;
      } else {
        count += value;
      }
      return count;
     }, 0);
    
    return `
     <article class="media">
      <figure class="media-left">
        <img src="${movieDetail.Poster}"/>
      </figure>
      <div class="media-content">
      <div class="content">
        <h1>${movieDetail.Title} </h1>
        <h4>${movieDetail.Genre} </h4>
        <p>${movieDetail.Plot} </p>
      </div>      
      </div>
     </article>
     <article data-value="${awards}" class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
     </article>
     <article data-value="${dollars}" class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">BoxOffice</p>
     </article>
     <article data-value="${metaScore}" class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
     </article>
     <article data-value="${imdbRating}" class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
     </article>
     <article data-value="${imdbVotes}" class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
     </article>
    
    
    `;

  }
  