const slides = document.querySelector(".slides");
const loader = document.querySelector(".lds-ellipsis");
const container = document.querySelector(".container-slider");
const containerDots = document.querySelector(".container-dots");
const $_containerDots = $(".container-dots");
const containerThumnail = document.querySelector(".thumbnail-container");

// init slides
let slideIndex = 1;

// init when loading first
const init = async () => {
  await setTimeout(() => {
    loader.style.opacity = 0;
    loader.style.display = "none";
    container.style.display = "block";
    containerThumnail.style.display = "block";
    setTimeout(() => (container.style.opacity = 1, containerThumnail.style.opacity = 1), 50);
    appendHtmlAuthor(slideIndex);
    appendHtmlOneImage(slideIndex);
  }, 2000);
};
init();

// handle API
const callAPI = (method, url) => {
  return $.ajax({
    url: `${url}`,
    method: method,
  });
};

const processDataImages = async () => {
  try {
    const response = await callAPI(
      "GET",
      "https://jsonplaceholder.typicode.com/photos?_start=0&_limit=10"
    );
    return response;
  } catch (err) {
    return err;
  }
};

const processDataAuthor = async (id) => {
  try {
    const response = await callAPI(
      "GET",
      `https://jsonplaceholder.typicode.com/users?id=${id}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

const processDataImagesWithId = async (id) => {
  try {
    const response = await callAPI(
      "GET",
      `https://jsonplaceholder.typicode.com/photos?_start=0&_limit=10&id=${id}`
    );
    return response;
  } catch (err) {
    return err;
  }
}

processDataImages().then((response) => {
  const images = {
    response,
  };
  let source = $("#image-template").html();
  let source2 = $("#thumbnail-template").html();
  let template = Handlebars.compile(source);
  let template2 = Handlebars.compile(source2);
  let html = template(images);
  let html_thumbnail = template2(images);
  $(".slides").html(html);
  $(".thumbnail-container").html(html_thumbnail);
  response.map((value) => {
    let dot = $("<div class='dot' data-id=" + value?.id + "></div>");
    $_containerDots.append(dot);
  });
  handleNextPrevImages(response);
});

const handleNextPrevImages = (response) => {
  // get all dots
  const dots = containerDots.querySelectorAll("*").forEach((dot, index) => {
    dot.addEventListener("click", (e) => {
      let id = $(e.currentTarget).data("id");
      appendHtmlAuthor(id);
      appendHtmlOneImage(id);
      moveDot(index + 1);
    });
  });

  // get all thumbnail child
  const thumbnail_child = containerThumnail.querySelectorAll("*").forEach((thumbnail, index) => {
    thumbnail.style.cursor = "pointer";
    thumbnail.addEventListener("click", (e) => {
      let id = $(e.currentTarget).data("id");
      appendHtmlAuthor(id);
      appendHtmlOneImage(id);
      moveDot(index + 1);
    })
  })
  
  // set dot
  const moveDot = (index) => {
    slideIndex = index;
    updateImage();
  };

  // Next Images
  const nextSlide = () => {
    if (slideIndex !== response.length) {
      ++slideIndex;
    } else if (slideIndex === response.length) {
      slideIndex = 1;
    }
    appendHtmlAuthor(slideIndex);
    appendHtmlOneImage(slideIndex);
    updateImage();
  };
  const nextBtn = document.querySelector(".next");
  nextBtn.onclick = nextSlide;

  // Prev Images
  const prevSlide = () => {
    if (slideIndex !== 1) {
      --slideIndex;
    } else if (slideIndex === 1) {
      slideIndex = response.length;
    }
    appendHtmlAuthor(slideIndex);
    appendHtmlOneImage(slideIndex);
    updateImage();
  };
  const prevBtn = document.querySelector(".prev");
  prevBtn.onclick = prevSlide;

  // Update Image when slick next or prev
  const updateImage = () => {
    const activeSlide = slides.querySelector("[data-active]");
    slides.children[slideIndex - 1].dataset.active = true;
    activeSlide && delete activeSlide.dataset.active;

    const activeDot = containerDots.querySelector("[data-active]");
    containerDots.children[slideIndex - 1].dataset.active = true;
    activeDot && delete activeDot.dataset.active;
  };
  // call first then set active class
  updateImage();
};

const appendHtmlAuthor = (id) => {
  processDataAuthor(id).then((response_author) => {
    const author = {
      response_author,
    };
    let source = $("#user-template").html();
    let template = Handlebars.compile(source);
    let html = template(author);
    $(".users").html(html);
  });
}

const appendHtmlOneImage = (id) => {
  processDataImagesWithId(id).then((response_img) => {
    const image = {
      response_img,
    };
    let source = $("#one-image-template").html();
    let template = Handlebars.compile(source);
    let html = template(image);
    $(".popup-content").html(html);
  });
}