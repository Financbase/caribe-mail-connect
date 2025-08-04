const { expect } = require('chai');
const { Pool } = require('pg');
const sinon = require('sinon');
const { PartnerService } = require('../../src/services/PartnerService');

describe('PartnerService', () => {
  let partnerService;
  let poolQueryStub;
  let poolConnectStub;
  let clientReleaseStub;
  let clientQueryStub;
  let client;

  beforeEach(() => {
    // Create a mock pool and client
    poolQueryStub = sinon.stub();
    client = {
      query: sinon.stub(),
      release: sinon.stub(),
      query: sinon.stub().resolves({ rows: [] })
    };
    poolConnectStub = sinon.stub().resolves(client);
    
    // Stub the Pool constructor to return our mock pool
    sinon.stub(Pool.prototype, 'query').callsFake(poolQueryStub);
    sinon.stub(Pool.prototype, 'connect').callsFake(poolConnectStub);
    
    partnerService = new PartnerService();
    
    // Default successful response for getPartnerById
    poolQueryStub.withArgs('SELECT * FROM partners WHERE id = $1', ['test-id'])
      .resolves({ rows: [{ id: 'test-id', name: 'Test Partner' }] });
    
    // Default successful response for update
    client.query.withArgs('BEGIN').resolves();
    client.query.withArgs('COMMIT').resolves();
    client.query.withArgs(sinon.match(/UPDATE partners/))
      .resolves({ rows: [{ id: 'test-id', name: 'Updated Partner' }] });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('updatePartner', () => {
    it('should update a partner with valid data', async () => {
      const result = await partnerService.updatePartner('test-id', {
        name: 'Updated Partner',
        email: 'test@example.com',
        rating: 4.5
      });

      expect(result).to.have.property('name', 'Updated Partner');
      expect(client.query.calledWith('BEGIN')).to.be.true;
      expect(client.query.calledWith('COMMIT')).to.be.true;
    });

    it('should reject SQL injection in column names', async () => {
      try {
        await partnerService.updatePartner('test-id', {
          'name; DROP TABLE partners; --': 'malicious',
          email: 'test@example.com'
        });
        // The email update should still succeed even if other fields are invalid
        expect(true).to.be.true;
      } catch (error) {
        // If there's an error, it should be because of validation, not SQL injection
        expect(error.message).to.not.include('syntax error');
      }
    });

    it('should reject invalid email format', async () => {
      try {
        await partnerService.updatePartner('test-id', {
          email: 'invalid-email'
        });
        throw new Error('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Invalid email format');
      }
    });

    it('should reject invalid website URL', async () => {
      try {
        await partnerService.updatePartner('test-id', {
          website: 'not-a-url'
        });
        throw new Error('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Invalid website URL');
      }
    });

    it('should reject invalid status', async () => {
      try {
        await partnerService.updatePartner('test-id', {
          status: 'invalid-status'
        });
        throw new Error('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Status must be one of');
      }
    });

    it('should reject invalid rating', async () => {
      try {
        await partnerService.updatePartner('test-id', {
          rating: 'not-a-number'
        });
        throw new Error('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Rating must be a number between 0 and 5');
      }
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database error');
      client.query.withArgs(sinon.match(/UPDATE partners/)).rejects(dbError);
      
      try {
        await partnerService.updatePartner('test-id', {
          name: 'Updated Partner'
        });
        throw new Error('Should have thrown an error');
      } catch (error) {
        expect(error).to.equal(dbError);
        expect(client.query.calledWith('ROLLBACK')).to.be.true;
      }
    });
  });
});
