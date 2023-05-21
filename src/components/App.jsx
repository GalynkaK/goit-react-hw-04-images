import React, { useEffect, useState } from 'react';
import Searchbar from './Searchbar';
import { getImage } from './Services/PixabayApi';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Modal from './Modal';
import Loader from './Loader';

const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState('');
  const [modalAlt, setModalAlt] = useState('');
  const [totalHits, setTotalHits] = useState(0);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    const inputSearch = e.target && e.target.elements && e.target.elements.inputSearch;
    if (!inputSearch || inputSearch.value.trim() === '') {
      setIsLoading(false);
      return;
    }
    try {
      const response = await getImage(inputSearch.value, 1);
      setImages(response);
      setIsLoading(false);
      setCurrentSearch(inputSearch.value);
      setPage(1);
      setTotalHits(response.totalHits);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleClickMore = async () => {
    const response = await getImage(currentSearch, page + 1);
    setImages([...images, ...response]);
    setPage(page + 1);
  };

  const handleImageClick = e => {
    setModalOpen(true);
    setModalImg(e.target.name);
    setModalAlt(e.target.alt);
  };

  const handleModalClose = e => {
    setModalOpen(false);
    setModalImg('');
    setModalAlt('');
  };

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        handleModalClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 40,
        color: '#010101'
      }}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <React.Fragment>
          <Searchbar onSubmit={handleSubmit} />
          <ImageGallery onImageClick={handleImageClick} images={images} />
          {images.length > 0 && images.length < totalHits ? (
            <Button onClick={handleClickMore} />
          ) : null}
        </React.Fragment>
      )}
      {modalOpen ? (
        <Modal src={modalImg} alt={modalAlt} handleClose={handleModalClose} />
      ) : null}
    </div>
  );
};

export default App;
