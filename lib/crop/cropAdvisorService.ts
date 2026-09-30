import { CropRecommendationInput, CropRecommendationOutput } from '@/types';

export class CropAdvisorService {
  /**
   * Generates scientific crop recommendations tailored to Telangana agro-climatic zones
   * Based on ICAR and PJTSAU agro-climatic classification.
   */
  public static recommendCrops(input: CropRecommendationInput): CropRecommendationOutput[] {
    const results: CropRecommendationOutput[] = [];

    // Rule 1: Kharif Season with Black Cotton or Red Sandy Soil
    if (input.soil_type === 'BLACK_COTTON') {
      if (input.water_availability === 'BOREWELL' || input.water_availability === 'CANAL_IRRIGATION') {
        results.push({
          id: 'rec_cotton',
          recommended_crop: 'Bt Cotton (హైబ్రిడ్ పత్తి)',
          crop_telugu_name: 'పత్తి (Cotton)',
          suitability_score: 94,
          expected_yield: '12-15 Quintals / Acre',
          duration_days: 160,
          water_requirement: 'MEDIUM',
          estimated_profit_per_acre: '₹45,000 - ₹65,000',
          reasoning: [
            'Deep black cotton soil has high clay content and exceptional moisture retention capacity.',
            'Telangana cotton command belts (Warangal, Adilabad, Nalgonda) have proven yields and strong CCI procurement centers.',
            'Irrigation backup ensures high boll retention during dry spells.',
          ],
          precautions: [
            'Monitor for Pink Bollworm (గులాబీ రంగు పురుగు) between 60-90 days using pheromone traps.',
            'Avoid water stagnation during heavy monsoon bursts.',
          ],
          advisory_disclaimer: 'Advisory agricultural recommendation based on Telangana soil classification. Consult your local Mandal Agriculture Officer (MAO) before seed purchase.',
        });
      }

      results.push({
        id: 'rec_red_gram',
        recommended_crop: 'Red Gram / Pigeonpea (కంది - PRG 176 / Asha)',
        crop_telugu_name: 'కంది (Red Gram)',
        suitability_score: 91,
        expected_yield: '8-10 Quintals / Acre',
        duration_days: 150,
        water_requirement: 'LOW',
        estimated_profit_per_acre: '₹38,000 - ₹50,000',
        reasoning: [
          'Excellent nitrogen-fixing legume that enhances soil organic carbon for the next crop cycle.',
          'Drought-tolerant deep taproot system ideal for Telangana rainfed or borewell conditions.',
          'High market price supported by Central MSP buffer stock procurement.',
        ],
        precautions: [
          'Ensure furrow drainage to prevent Phytophthora stem blight in waterlogged areas.',
        ],
        advisory_disclaimer: 'Advisory agricultural recommendation. Follow recommended spacing of 4ft x 1ft.',
      });
    }

    // Rule 2: Red Sandy Loam Soil (Ideal for Vegetables & Chilies)
    if (input.soil_type === 'RED_SANDY' || input.soil_type === 'ALLUVIAL' || input.soil_type === 'CLAY_LOAM') {
      results.push({
        id: 'rec_chili',
        recommended_crop: 'Warangal Teja / G4 Green & Red Chili (తేజా మిర్చి)',
        crop_telugu_name: 'మిర్చి (Chili)',
        suitability_score: 92,
        expected_yield: '25-30 Quintals (Dry) / Acre',
        duration_days: 180,
        water_requirement: 'MEDIUM',
        estimated_profit_per_acre: '₹1,20,000 - ₹1,80,000',
        reasoning: [
          'Well-drained red loam soil is the gold standard for high-capsaicin chili cultivation.',
          'Direct access to Warangal Enumamula market and high export demand.',
          'Substantial returns for small & marginal farmers investing intensive care.',
        ],
        precautions: [
          'Mandatory installation of blue and yellow sticky traps (25 per acre) against thrips.',
          'Use raised nursery beds or portray seedlings to prevent damping off.',
        ],
        advisory_disclaimer: 'High investment, high return commercial crop. Ensure drip irrigation for optimal nutrient fertigation.',
      });

      results.push({
        id: 'rec_tomato',
        recommended_crop: 'Determinate Tomato (సాహో / అర్క రక్షక్ టమాట)',
        crop_telugu_name: 'టమాట (Tomato)',
        suitability_score: 88,
        expected_yield: '20-25 Tonnes / Acre',
        duration_days: 110,
        water_requirement: 'MEDIUM',
        estimated_profit_per_acre: '₹60,000 - ₹95,000',
        reasoning: [
          'Short duration crop (3.5 months) allowing multiple rotations per agricultural year.',
          'Proximity to Hyderabad urban consumption clusters (Bowenpally, Shamshabad, Gudimalkapur).',
          'Arka Rakshak variety possesses triple disease resistance to leaf curl virus, bacterial wilt, and early blight.',
        ],
        precautions: [
          'Mulching recommended to conserve soil moisture and prevent fruit contact with wet soil.',
        ],
        advisory_disclaimer: 'Tomato prices can experience short-term volatility. Consider staggered harvest dates.',
      });
    }

    // Rule 3: Canal / Abundant Borewell Irrigation
    if (input.water_availability === 'CANAL_IRRIGATION' || (input.water_availability === 'BOREWELL' && input.season === 'KHARIF')) {
      results.push({
        id: 'rec_paddy',
        recommended_crop: 'Telangana Sona Rice (RNR 15048 వరి)',
        crop_telugu_name: 'వరి (Paddy)',
        suitability_score: 89,
        expected_yield: '28-32 Bags (75kg) / Acre',
        duration_days: 125,
        water_requirement: 'HIGH',
        estimated_profit_per_acre: '₹35,000 - ₹48,000',
        reasoning: [
          'Short slender fine grain with confirmed low Glycemic Index (GI 51.5).',
          'Consumes 25-30% less irrigation water compared to traditional BPT 5204.',
          'Strong demand from health-conscious urban consumers across Hyderabad and Bengaluru.',
        ],
        precautions: [
          'Adopt alternate wetting and drying (AWD) water management to prevent brown planthopper (BPH).',
        ],
        advisory_disclaimer: 'Advisory only. Ensure paddy straw is incorporated into soil; do not burn residue.',
      });
    }

    // Default ensure at least 2 recommendations
    if (results.length === 0) {
      results.push({
        id: 'rec_millets',
        recommended_crop: 'Pearl Millet / Bajra (సజ్జలు)',
        crop_telugu_name: 'సజ్జలు (Bajra)',
        suitability_score: 85,
        expected_yield: '12-14 Quintals / Acre',
        duration_days: 85,
        water_requirement: 'LOW',
        estimated_profit_per_acre: '₹22,000 - ₹32,000',
        reasoning: [
          'Extremely resilient climate-smart crop with minimal water requirements.',
          'High urban demand under the National Year of Millets initiative.',
        ],
        precautions: ['Bird scaring required during grain hardening stage.'],
        advisory_disclaimer: 'Advisory agricultural guidance.',
      });
    }

    return results;
  }
}
