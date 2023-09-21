export const handleSelect = (e, ops) => {
  let container = getParentNode(e, ops.containerClass);
  let attributes = container.querySelectorAll("." + ops.childClass);
  let isAgain = false;
  if (e.classList.contains("active")) {
    isAgain = true;
  }
  attributes.forEach((attribute) => {
    attribute.classList.remove("active");
  });

  if (!isAgain) {
    e.classList.add("active");
  }
};
export const getParentNode = (e, className) => {
  let slides = e;
  while (!slides.classList.contains(className)) {
    slides = slides.parentNode;
  }
  return slides;
};
export let pos = 0;
export const handleNext = (e, ops) => {
  // Lấy listMedia, prev, next button, độ rộng của phần tử để chuyển slide
  let slides = getParentNode(e, ops.slider);
  let prev = slides.querySelector("." + ops.prevButton);
  let next = slides.querySelector("." + ops.nextButton);
  let itemWidth = slides.querySelector(ops.cellSelector).offsetWidth;

  // Lấy div.mediaSlide-contain
  slides = slides.querySelector("." + ops.container);

  // Biến cho biết đã gần cuối của listMedia
  let indexPos = slides.offsetWidth - slides.scrollWidth + itemWidth;

  if (pos > slides.offsetWidth - slides.scrollWidth) {
    // khi vị trí hiện tại đã gần cuối thì khi kích vào next sẽ disable nút next
    if (Math.abs(pos - indexPos) < 2) {
      next.classList.add("disable");
    }
    pos -= itemWidth;

    slides.style.transform = "translateX(" + pos + "px)";
    prev.classList.remove("disable");
  }
};
export const handlePrev = (e, ops) => {
  // Lấy listMedia, prev, next button, độ rộng của phần tử để chuyển slide
  let slides = getParentNode(e, ops.slider);
  let prev = slides.querySelector("." + ops.prevButton);
  let next = slides.querySelector("." + ops.nextButton);
  let itemWidth = slides.querySelector(ops.cellSelector).offsetWidth;

  // Lấy div.mediaSlide-contain
  slides = slides.querySelector("." + ops.container);

  if (pos < 0) {
    // khi vị trí hiện tại đã gần vị trí đầu thì khi kích vào prev sẽ disable nút prev
    if (pos === -itemWidth) {
      prev.classList.add("disable");
    }
    pos += itemWidth;
    slides.style.transform = "translateX(" + pos + "px)";
    next.classList.remove("disable");
  }
};
export const handleHover = (e, isHover) => {
  let mediaContainer = getParentNode(e, "mediaSlide-contain");
  let activeMedia = mediaContainer.querySelector(".mediaSlide-media.active");
  if (isHover) {
    if (e.tagName === "IMG") {
      let image = document.querySelector("#media.media .image");
      image.src = e.src;
    } else {
      let video = document.querySelector("#media.media .video");
      video.src = e.src;
    }
  } else {
    let image = document.querySelector("#media.media .image");
    image.src = activeMedia.src;
  }
};
export const handleLike = (e) => {
  let like = getParentNode(e, "like");
  if (like.classList.contains("active")) {
    like.classList.remove("active");
  } else {
    like.classList.add("active");
  }
};

export const initial2DArray = (row, col) => {
  const array2D = [];
  
  for (let i = 0; i < row; i++) {
      let array1D = [];
      for (let j = 0; j < col; j++) {
          array1D[j] = 0;
      }
      array2D[i] = array1D;
  }

  return array2D;
};
