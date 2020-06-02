// InstallModal.js

/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const InstallModal = (props) => {
  const {
    className
  } = props;

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const deferredPrompt = useRef(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt.current = e;
      // Update UI notify the user they can install the PWA
      setModal(true);
    });
  }, []);

  const handleInstallClick = () => {
      // Hide the app provided install promotion
      setModal(false);
      // Show the install prompt
      deferredPrompt.current.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.current.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
      });
  };

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Install this app?</ModalHeader>
        <ModalBody>
          You can install this app to your mobile device for
          faster functionality and better performance.

        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Don't Install</Button>{' '}
          <Button color="primary" onClick={handleInstallClick}>Install</Button>{' '}
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default InstallModal;