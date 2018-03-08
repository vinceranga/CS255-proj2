"use strict";

/********* Imports ********/

import {
  /* The following functions are all of the cryptographic
  primatives that you should need for this assignment.
  See lib.js for details on usage. */
  HMACWithSHA256,
  HMACWithSHA512,
  SHA256,
  SHA512,
  HKDF,
  encryptWithGCM,
  decryptWithGCM,
  generateEG,
  computeDH,
  generateECDSA,
  signWithECDSA,
  verifyWithECDSA,
  randomHexString,
} from "./lib";

/********* Implementation ********/


export default class MessengerClient {
  constructor(certAuthorityPublicKey) {
      // the certificate authority DSA public key is used to
      // verify the authenticity and integrity of certificates
      // of other users (see handout and receiveCertificate)

      // you can store data as needed in these objects.
      // Feel free to modify their structure as you see fit.
      this.caPublicKey = certAuthorityPublicKey;
      this.conns = {}; // data for each active connection
      this.certs = {}; // certificates of other users
    };


  generateCertificate(username) {
    throw("not implemented!");
    const certificate = {};
    return certificate;
  }


  receiveCertificate(certificate, signature) {
    throw("not implemented!");
  }


  sendMessage(name, plaintext) {
    throw("not implemented!");
    const ciphertext = "";
    // Generate header with info so that other party can increment ratchet
    // and decrypt the message properly
    const header = {};
    return [header, ciphertext];
  }


  receiveMessage(name, [header, ciphertext]) {
    throw("not implemented!");
    return plaintext;
  }
};
