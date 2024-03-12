// carousel
const buttons = document.querySelectorAll("[data-carousel-button]")

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const offset = button.dataset.carouselButton === "next" ? 1 : -1
    const slides = button
      .closest("[data-carousel]")
      .querySelector("[data-slides]")

    const activeSlide = slides.querySelector("[data-active]")
    let newIndex = [...slides.children].indexOf(activeSlide) + offset
    if (newIndex < 0) newIndex = slides.children.length - 1
    if (newIndex >= slides.children.length) newIndex = 0
    clearTimeout(myTimeout);
    
    showNextImage(newIndex, slides, activeSlide)
  })
})

function showNextImage(newIndex, slides, activeSlide){
  delete activeSlide.dataset.active
  slides.children[newIndex].dataset.active = true
  resizeText(slides.children[newIndex], "comment");
  myTimeout = setTimeout(selectNextImage, 5000);
}

function selectNextImage(){
  const slides = document.querySelector("[data-slides]")
  const activeSlide = slides.querySelector("[data-active]")
  let newIndex = [...slides.children].indexOf(activeSlide) + 1
  if (newIndex < 0) newIndex = slides.children.length - 1
  if (newIndex >= slides.children.length) newIndex = 0
  showNextImage(newIndex, slides, activeSlide)
}


//reviews
document.addEventListener('DOMContentLoaded', () => {
  
  const reviewElement = document.getElementById('reviews-list');
  let index = true;

  fetch('reviews.json')
    .then(response => response.json())
    .then(reviews => {
      reviewsList = reviews.reviews
      reviewsList.forEach(review => {
        let activeSlide = index?`data-active`: ``;
        let stars = review.starRating == "FIVE" ? `<span class="star">&#9733;</span>
                                                  <span class="star">&#9733;</span>
                                                  <span class="star">&#9733;</span>
                                                  <span class="star">&#9733;</span>
                                                  <span class="star">&#9733;</span>`:  
                                                  `<span class="star">&#9734;</span>
                                                  <span class="star">&#9733;</span>
                                                  <span class="star">&#9733;</span>
                                                  <span class="star">&#9733;</span>
                                                  <span class="star">&#9733;</span>`;
        let comment = review.comment? `<p class="comment">${review.comment}</p>`: ``
        if (review.comment){
          reviewElement.insertAdjacentHTML('beforeend', 
            `<li class="slide" ${activeSlide}>
              <div class="review-info">
                <img src="${review.reviewer.profilePhotoUrl}" alt="profile photo">
                <p class="review-text"> ${review.reviewer.displayName}</p>
                <div class="star-cont">
                  ${stars}
                </div>
                <p class="review-text">${review.updateTime.slice(0, 10)}</p>
              </div>
              ${comment}
            </li>`)
          index = false;
        }
      });
      selectNextImage()
    })
    .catch(error => console.error('Error fetching reviews:', error));


  // media
  const mediaElement = document.getElementById('media-list');
  let width = 0;

  fetch('media.json')
    .then(response => response.json())
    .then(media => {
      mediaList = media.mediaItems
      viewportWidth = window.innerWidth;
      mediaList.forEach(media => {
        if (media.mediaFormat == "PHOTO"){
            mediaElement.insertAdjacentHTML('beforeend', `<img class="media" src="${media.googleUrl}" alt="landscaping in North Port" loading="lazy">`);
            
            raw_width = media.dimensions.widthPixels
            raw_height = media.dimensions.heightPixels
            
            width += (raw_width * (viewportWidth * .32)) / raw_height
        }
      });

      startScrolling(mediaElement);
      
      // let imgs = document.querySelectorAll("img");
      
      // len = imgs.length
      // counter = 0;
      

      // imgs.forEach((img) => (img.complete ? incrementCounter() : img.addEventListener("load", incrementCounter, false)));

      // function incrementCounter() {
      //   counter++;
      //   if (counter == len) {
          
      //   }
      // }
    
    })
    .catch(error => console.error('Error fetching media:', error));


  // posts
  const postElement = document.getElementById('post-list');

  fetch('posts.json')
  .then(response => response.json())
  .then(posts => {
    postList = posts.localPosts
    let postsRendered = 0;
    let i = 0

    while (postsRendered < 3){
      let post = postList[i]
      let postMedia = ``
      let pass = true;
      media = post.media[0]
      if (media.mediaFormat == "PHOTO"){
        postMedia  += `<img class="postMedia" src="${media.googleUrl}" alt="landscaping in North Port">`; 
      }else{
        pass = false;}                   
      if (pass){
        postElement.insertAdjacentHTML('beforeend', 
                                  `<li class="post">
                                    <div class="postMediaCont">
                                      ${postMedia}
                                    </div>
                                    <div class="postWords"> 
                                      <p class="postSummary">${post.summary} <br> ${post.updateTime.slice(0, 10)}</p>
                                    </div>
                                  </li>`);
        postsRendered += 1;
      }
      i += 1
    };
    [...document.getElementsByClassName("postWords")].forEach(element => {resizeText(element, "postSummary")});
  })
  .catch(error => console.error('Error fetching media:', error));
  
});

function startScrolling(mediaElement, width){
  // if (window.innerWidth <= 480){ 
  //   scrollSpeed = 20
  // }else{
  scrollSpeed = 10
  // }
  
  // const galleryWidth = mediaElement.scrollWidth;
  let galleryWidth = width
  let scrollPosition = 0;

  setInterval(() => {
    scrollPosition += 1;
    if (scrollPosition >= galleryWidth) {
      scrollPosition = 0;
    }
    mediaElement.scrollTo(scrollPosition, 0);
  }, scrollSpeed);
}

function menu() {
  var navMenu = document.getElementById('nav-menu');
  navMenu.style.left = '0';
  document.addEventListener('click', closeMenuOutsideClick);
  event.stopPropagation();
}

function closeMenuOutsideClick(event) {
  var navMenu = document.getElementById('nav-menu');
  var rightArrow = document.getElementById("services-arrow-right");
  if (!navMenu.contains(event.target)) {
      navMenu.style.left = '-40vw';
      document.removeEventListener('click', closeMenuOutsideClick);
      if (window.getComputedStyle(rightArrow).opacity == 0){
        toggleServicesNavigation()
      }
  }
}

function toggleServicesNavigation() {
  const servicesNavigation = document.querySelector('.services-navigation');
  const downArrow = document.querySelector('.services-arrow-down');
  const rightArrow = document.querySelector('.services-arrow-right');
  servicesNavigation.classList.toggle('visible');
  rightArrow.classList.toggle('visible');
  downArrow.classList.toggle('visible');
}

function sendEmail(){

  let name = document.getElementById('senderName').value;
  let number = document.getElementById('phoneNumber').value;
  let emailAddress = document.getElementById('email').value;
  let messageBody = document.getElementById('message').value;

  const url = 'https://x3a459t8nd.execute-api.us-east-2.amazonaws.com/production';

  const data = {
      name: name,
      phoneNumber: number,
      email: emailAddress,
      text: messageBody
  };

  const requestOptions = {
      method: 'POST', 
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  };

  fetch(url, requestOptions)
      .then(response => response.json()) // Parse the JSON response
      .then(data => console.log(data)) // Handle the response data
      .catch(error => console.error('Error:', error)); // Handle any errors

  document.getElementById('senderName').value = "";
  document.getElementById('phoneNumber').value = "";
  document.getElementById('email').value = "";
  document.getElementById('message').value = "";
  let gratitude = document.getElementById('gratitude-window');
  gratitude.classList.toggle('visible');
}

function resizeText(activeSlide, className) {
  const element = activeSlide.getElementsByClassName(className)[0]
 
  var size = parseFloat(window.getComputedStyle(element).fontSize);

  const parentHeight = parseFloat(window.getComputedStyle(element.parentElement).height);
  
  while (parseFloat(window.getComputedStyle(element).height) > parentHeight)
  {
    size -= 1;
    element.style.fontSize = size + "px"
  }
}








