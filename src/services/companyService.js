const db = require('../models');

class CompanyService {
  async updateProfile(userId, data) {
    const company = await db.Company.findOne({ where: { userId } });
    if (!company) throw new Error('Company không tồn tại');

    const updateData = {};
    for (const key of ['companyName', 'taxCode', 'industry', 'website', 'description']) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }

    if (Object.keys(updateData).length > 0) {
      await company.update(updateData);
    }

    return company;
  }
}

module.exports = new CompanyService();