import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import React from "react";
import GambarSatu from "../assets/BINUS-@Bekasi-gedung.jpeg";
import GambarDua from "../assets/BINUS-@Malang-gedung.jpeg";
import GambarTiga from "../assets/Caroulser_Image_3.jpg";

const images = [GambarSatu, GambarDua, GambarTiga];

function ImageCaroulser() {
  return (
    <>
      <div className="flex justify-center w-full">
        <div className="box w-full max-w-2xl">
          <Carousel useKeyboardArrows={true} showThumbs={false}>
            {images.map((URL, index) => (
              <div className="slide" key={index}>
                <div className="aspect-video">
                  <img
                    alt="sample_file"
                    src={URL}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </>
  );
}

export default ImageCaroulser;
