"use strict";

import MessengerClient from '../messenger.js';
import { SHA256, generateECDSA, signWithECDSA } from '../lib.js';
import { expect } from 'chai';
import sjcl from '../sjcl';

const stringifyCert = function(cert) {
    if (typeof cert == 'object') {
      return JSON.stringify(cert);
    } else if (typeof cert == 'string') {
      return cert;
    } else {
      throw "Certificate is not a JSON or string";
    }
}


describe('Messenger', function() {
  this.timeout(5000);
  const caKeyPair = generateECDSA(); // keypair for the certificate certAuthority
  // which will sign all certificates generated by clients before relaying
  // them to other clients (see handout)



  describe('functionality', function() {
    it('imports a certificate without an error', function() {
      let alice = new MessengerClient(caKeyPair.pub);
      let bob = new MessengerClient(caKeyPair.pub);
      const aliceCertificate = alice.generateCertificate('alice');
      const bobCertificate = bob.generateCertificate('bob');

      const bobCertSignature = signWithECDSA(caKeyPair.sec, stringifyCert(bobCertificate));
      alice.receiveCertificate(bobCertificate, bobCertSignature);
    });

    it('generates an encrypted message without error', function() {
      let alice = new MessengerClient(caKeyPair.pub);
      let bob = new MessengerClient(caKeyPair.pub);
      const aliceCertificate = alice.generateCertificate('alice');
      const bobCertificate = bob.generateCertificate('bob');
      const bobCertSignature = signWithECDSA(caKeyPair.sec, stringifyCert(bobCertificate));
      alice.receiveCertificate(bobCertificate, bobCertSignature);
      alice.sendMessage('bob', 'Hello, Bob');
    });

    it('bob can recieve an encrypted message from alice', function() {
      let alice = new MessengerClient(caKeyPair.pub);
      let bob = new MessengerClient(caKeyPair.pub);
      const aliceCertificate = alice.generateCertificate('alice');
      const bobCertificate = bob.generateCertificate('bob');
      const aliceCertSignature = signWithECDSA(caKeyPair.sec, stringifyCert(aliceCertificate));
      const bobCertSignature = signWithECDSA(caKeyPair.sec, stringifyCert(bobCertificate));
      alice.receiveCertificate(bobCertificate, bobCertSignature);
      bob.receiveCertificate(aliceCertificate, aliceCertSignature);
      const message = 'Hello, Bob'
      const ct = alice.sendMessage('bob', message);
      const result = bob.receiveMessage('alice', ct);
      expect(result).to.equal(message);
    });

    it('alice and bob can have a conversation', function() {
      let alice = new MessengerClient(caKeyPair.pub);
      let bob = new MessengerClient(caKeyPair.pub);
      const aliceCertificate = alice.generateCertificate('alice');
      const bobCertificate = bob.generateCertificate('bob');
      const aliceCertSignature = signWithECDSA(caKeyPair.sec, stringifyCert(aliceCertificate));
      const bobCertSignature = signWithECDSA(caKeyPair.sec, stringifyCert(bobCertificate));
      alice.receiveCertificate(bobCertificate, bobCertSignature);
      bob.receiveCertificate(aliceCertificate, aliceCertSignature);
      let message = 'Hello, Bob'
      let ct = alice.sendMessage('bob', message);
      let result = bob.receiveMessage('alice', ct);
      expect(result).to.equal(message);
      message = 'Hello, Alice'
      ct = bob.sendMessage('alice', message);
      result = alice.receiveMessage('bob', ct);
      expect(result).to.equal(message);
      message = 'Meet for lunch?'
      ct = bob.sendMessage('alice', message);
      result = alice.receiveMessage('bob', ct);
      expect(result).to.equal(message);
    });
  });
});
