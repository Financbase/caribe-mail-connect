const { logger } = require('../utils/logger');
const { isEmail } = require('validator');
const { URL } = require('url');
const { pool } = require('../config/database');

class PartnerService {
  constructor() {
    // Database connection is now managed by the database.js config
    this.pool = pool;
  }

  async getPartners(filters = {}) {
    try {
      let query = 'SELECT * FROM partners WHERE 1=1';
      const params = [];
      let paramIndex = 1;

      // Apply filters
      if (filters.type) {
        query += ` AND type = $${paramIndex}`;
        params.push(filters.type);
        paramIndex++;
      }

      if (filters.status) {
        query += ` AND status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }

      if (filters.search) {
        query += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
        params.push(`%${filters.search}%`);
        paramIndex++;
      }

      if (filters.rating) {
        query += ` AND rating >= $${paramIndex}`;
        params.push(filters.rating);
        paramIndex++;
      }

      // Add pagination
      const limit = filters.limit || 20;
      const offset = (filters.page - 1) * limit || 0;

      query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limit, offset);

      const result = await this.pool.query(query, params);

      // Get total count for pagination
      let countQuery = 'SELECT COUNT(*) FROM partners WHERE 1=1';
      const countParams = [];
      paramIndex = 1;

      if (filters.type) {
        countQuery += ` AND type = $${paramIndex}`;
        countParams.push(filters.type);
        paramIndex++;
      }

      if (filters.status) {
        countQuery += ` AND status = $${paramIndex}`;
        countParams.push(filters.status);
        paramIndex++;
      }

      if (filters.search) {
        countQuery += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
        countParams.push(`%${filters.search}%`);
        paramIndex++;
      }

      if (filters.rating) {
        countQuery += ` AND rating >= $${paramIndex}`;
        countParams.push(filters.rating);
        paramIndex++;
      }

      const countResult = await this.pool.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count);

      return {
        partners: result.rows,
        pagination: {
          page: filters.page || 1,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting partners:', error);
      throw error;
    }
  }

  async getPartnerById(id) {
    try {
      const query = 'SELECT * FROM partners WHERE id = $1';
      const result = await this.pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error getting partner by ID:', error);
      throw error;
    }
  }

  async createPartner(partnerData) {
    try {
      const query = `
        INSERT INTO partners (
          name, type, logo_url, website, email, phone, address, 
          contact_person, status, rating, join_date, last_activity
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;
      
      const values = [
        partnerData.name,
        partnerData.type,
        partnerData.logo_url,
        partnerData.website,
        partnerData.email,
        partnerData.phone,
        JSON.stringify(partnerData.address || {}),
        JSON.stringify(partnerData.contact_person || {}),
        partnerData.status || 'pending',
        partnerData.rating || 0,
        partnerData.join_date || new Date(),
        partnerData.last_activity || new Date(),
      ];

      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating partner:', error);
      throw error;
    }
  }

  /**
   * Validates partner data before updating
   * @param {Object} data - The data to validate
   * @throws {Error} If validation fails
   */
  validatePartnerData(data) {
    const errors = [];
    const unknownFields = [];
    const validStatuses = ['pending', 'active', 'inactive', 'suspended'];
    
    // Check for unknown fields
    const allowedFields = [
      'name', 'type', 'logo_url', 'website', 'email', 'phone', 
      'address', 'contact_person', 'status', 'rating', 'join_date', 
      'last_activity', 'description', 'tax_id'
    ];

    Object.keys(data).forEach(key => {
      if (!allowedFields.includes(key)) {
        unknownFields.push(key);
      }
    });

    // Log unknown fields for security monitoring
    if (unknownFields.length > 0) {
      logger.warn(`Attempted to update with unknown fields: ${unknownFields.join(', ')}`, {
        service: 'PartnerService',
        method: 'updatePartner',
        unknownFields
      });
    }

    // Validate email format if provided
    if (data.email && !isEmail(data.email)) {
      errors.push('Invalid email format');
    }

    // Validate URL format if provided
    if (data.website) {
      try {
        // This will throw if URL is invalid
        new URL(data.website);
      } catch (e) {
        errors.push('Invalid website URL');
      }
    }

    // Validate status if provided
    if (data.status && !validStatuses.includes(data.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    // Validate rating if provided
    if (data.rating !== undefined) {
      const rating = parseFloat(data.rating);
      if (isNaN(rating) || rating < 0 || rating > 5) {
        errors.push('Rating must be a number between 0 and 5');
      }
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join('; ')}`);
    }
  }

  async updatePartner(id, updateData) {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const existingPartner = await this.getPartnerById(id);
      if (!existingPartner) {
        return null;
      }

      // Validate input data
      this.validatePartnerData(updateData);

      // Define allowed fields that can be updated
      const allowedFields = [
        'name', 'type', 'logo_url', 'website', 'email', 'phone', 
        'address', 'contact_person', 'status', 'rating', 'join_date', 
        'last_activity', 'description', 'tax_id'
      ];

      const fields = [];
      const values = [];
      let paramIndex = 1;
      const updatedFields = [];

      // Build dynamic update query with validation
      Object.entries(updateData).forEach(([key, value]) => {
        // Only process allowed fields
        if (value !== undefined && allowedFields.includes(key)) {
          fields.push(`"${key}" = $${paramIndex}`);
          updatedFields.push(key);
          
          // Handle JSON fields
          if (key === 'address' || key === 'contact_person') {
            values.push(JSON.stringify(value));
          } else {
            values.push(value);
          }
          
          paramIndex++;
        }
      });

      if (fields.length === 0) {
        logger.info('No valid fields to update', {
          service: 'PartnerService',
          method: 'updatePartner',
          partnerId: id
        });
        return existingPartner;
      }

      // Always update the updated_at timestamp
      fields.push('updated_at = $' + paramIndex);
      values.push(new Date());
      values.push(id);

      const query = `
        UPDATE partners 
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex + 1}
        RETURNING *
      `;

      logger.debug('Executing partner update query', {
        service: 'PartnerService',
        method: 'updatePartner',
        query: query.replace(/\s+/g, ' ').trim(),
        updatedFields,
        partnerId: id
      });

      const result = await client.query(query, values);
      await client.query('COMMIT');
      
      logger.info('Successfully updated partner', {
        service: 'PartnerService',
        method: 'updatePartner',
        partnerId: id,
        updatedFields
      });
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      
      logger.error('Error updating partner', {
        service: 'PartnerService',
        method: 'updatePartner',
        error: error.message,
        stack: error.stack,
        partnerId: id,
        updateData: JSON.stringify(updateData)
      });
      
      // Rethrow the error for the route handler to handle
      throw error;
    } finally {
      client.release();
    }
  }

  async deletePartner(id) {
    try {
      const query = 'DELETE FROM partners WHERE id = $1 RETURNING id';
      const result = await this.pool.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      logger.error('Error deleting partner:', error);
      throw error;
    }
  }

  async getPartnerContracts(partnerId) {
    try {
      const query = 'SELECT * FROM partner_contracts WHERE partner_id = $1 ORDER BY created_at DESC';
      const result = await this.pool.query(query, [partnerId]);
      return result.rows;
    } catch (error) {
      logger.error('Error getting partner contracts:', error);
      throw error;
    }
  }

  async getPartnerCommissions(partnerId, period = null) {
    try {
      let query = 'SELECT * FROM commissions WHERE partner_id = $1';
      const params = [partnerId];

      if (period) {
        query += ' AND period = $2';
        params.push(period);
      }

      query += ' ORDER BY created_at DESC';
      const result = await this.pool.query(query, params);
      return result.rows;
    } catch (error) {
      logger.error('Error getting partner commissions:', error);
      throw error;
    }
  }

  async getPartnerAnalytics(partnerId, period = '30d') {
    try {
      // Calculate date range based on period
      const now = new Date();
      let startDate;
      
      switch (period) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Get analytics data
      const analyticsQuery = `
        SELECT 
          COUNT(*) as total_contracts,
          SUM(total_value) as total_revenue,
          AVG(commission_rate) as avg_commission_rate,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_contracts
        FROM partner_contracts 
        WHERE partner_id = $1 AND created_at >= $2
      `;

      const analyticsResult = await this.pool.query(analyticsQuery, [partnerId, startDate]);

      // Get commission data
      const commissionQuery = `
        SELECT 
          SUM(amount) as total_commissions,
          COUNT(*) as commission_count,
          COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_commissions
        FROM commissions 
        WHERE partner_id = $1 AND created_at >= $2
      `;

      const commissionResult = await this.pool.query(commissionQuery, [partnerId, startDate]);

      return {
        period,
        startDate,
        endDate: now,
        contracts: analyticsResult.rows[0] || {},
        commissions: commissionResult.rows[0] || {},
      };
    } catch (error) {
      logger.error('Error getting partner analytics:', error);
      throw error;
    }
  }

  async close() {
    await this.pool.end();
  }
}

module.exports = { PartnerService }; 