                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                    color: AppColors.text,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'เลือกได้หลายอัน',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.textMuted,
                  ),
                ),
                const SizedBox(height: 12),

                // Income type cards
                _IncomeTypeCard(
                  title: 'พนักงานประจำ',
                  examples: 'เช่น: พนักงานบริษัท, ข้าราชการ, พนักงานห้าง',
                  icon: Icons.business_center_outlined,
                  isSelected: taxState.hasSalary,
                  onChanged: taxState.toggleSalary,
                ),
                const SizedBox(height: 8),
                _IncomeTypeCard(
                  title: 'ฟรีแลนซ์ / รับจ้าง',
                  examples: 'เช่น: รับออกแบบ, ขับ Grab, ติวเตอร์, ช่างภาพ',
                  icon: Icons.laptop_mac_outlined,
                  isSelected: taxState.hasFreelance,
                  onChanged: taxState.toggleFreelance,
                ),
                const SizedBox(height: 8),
                _IncomeTypeCard(
                  title: 'ค้าขาย / ออนไลน์',
                  examples: 'เช่น: ร้านของชำ, ขายออนไลน์, ตลาดนัด',
                  icon: Icons.storefront_outlined,
                  isSelected: taxState.hasMerchant,
                  onChanged: taxState.toggleMerchant,
                ),

                const SizedBox(height: 20),

                // Show income sliders based on selection
                if (!taxState.hasAnyIncomeType)
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceVariant,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.info_outline, color: AppColors.textMuted, size: 20),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'กรุณาเลือกประเภทรายได้ของคุณ',
                            style: TextStyle(
                              color: AppColors.textSecondary,
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                if (taxState.hasAnyIncomeType) ...[
                  Text(
                    'กรอกรายได้ของคุณ',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                      color: AppColors.text,
                    ),
                  ),
                  const SizedBox(height: 8),

                  if (taxState.hasSalary)
                    IncomeSlider(
                      label: 'เงินเดือน (ทั้งปี รวมโบนัส)',
                      sublabel: 'เงินได้ประเภทที่ 1',
                      value: taxState.salary,
                      min: 0,
                      max: TaxConstants.incomeSliderMax,
                      color: AppColors.income,
                      onChanged: taxState.setSalary,
                    ),

                  if (taxState.hasFreelance)
                    IncomeSlider(
                      label: 'รายได้ฟรีแลนซ์ / ปี',
                      sublabel: 'เงินได้ประเภทที่ 2',
                      value: taxState.freelance,
                      min: 0,
                      max: TaxConstants.incomeSliderMax,
                      color: AppColors.income,
                      onChanged: taxState.setFreelance,
                    ),

                  if (taxState.hasMerchant) ...[
                    IncomeSlider(
                      label: 'รายได้จากการขาย / ปี',
                      sublabel: 'เงินได้ประเภทที่ 8',
                      value: taxState.merchant,
                      min: 0,
                      max: TaxConstants.incomeSliderMax,
                      color: AppColors.income,
                      onChanged: taxState.setMerchant,
                    ),
                    // Import from Business Mode button
                    Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: OutlinedButton.icon(
                        onPressed: () async {
                          final year = DateTime.now().year;
                          final businessIncome = await DatabaseHelper.instance.getYearlyBusinessIncome(year);
                          if (!context.mounted) return;
                          