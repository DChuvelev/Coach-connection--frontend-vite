import React from 'react';
import './ItemModal.css';
import Modal from '../Modal/Modal';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import { useContext } from 'react';
export default function ItemModal( {activeModal, card, onClose, handleDelete} ) {
    const { currentUser } = useContext(CurrentUserContext);
    const isOwner = currentUser._id === card.owner;
    return (
        <Modal activeModal={activeModal} onClose={onClose}>
            <img className='item-modal__picture' src={card.imageUrl} alt={`${card.name}`}/>
            <p className='item-modal__title'>{card.name}</p>
            <p className='item-modal__weather'>Weather: {card.weather}</p>
            {isOwner && <button className='item-modal__delete-btn' onClick={() => {handleDelete(card)}}>Delete item</button>}
        </Modal>
    )
}