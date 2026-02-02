export const getSmartAddress = (fullAddress) => {
  if (!fullAddress) return 'Unknown Location';
  
  const parts = fullAddress.split(',').map(p => p.trim()).filter(p => p !== '');
  
  // Identify patterns in Bangladeshi addresses
  const resultParts = [];
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const lowerPart = part.toLowerCase();
    
    // Handle "_____ district" pattern - extract just the district name
    if (lowerPart.endsWith(' district')) {
      // Extract district name (remove " district" suffix)
      const districtName = part.substring(0, part.length - 9).trim();
      
      // Only add if it's a meaningful district name
      if (districtName && !resultParts.includes(districtName)) {
        resultParts.push(districtName);
      }
      continue;
    }
    
    // Skip other administrative divisions or postal code
    if (
      lowerPart.includes('division') ||
      lowerPart.includes('metropolitan') ||
      lowerPart.includes('post code') ||
      lowerPart.includes('zip code') ||
      /^\d+$/.test(part) ||
      lowerPart === 'bangladesh' ||
      lowerPart.includes(' upazila') ||
      lowerPart.includes(' union')
    ) {
      continue;
    }
    
    // Check if this is likely a street/road/avenue
    const isStreet = lowerPart.includes('road') || 
                    lowerPart.includes('rd') ||
                    lowerPart.includes('street') ||
                    lowerPart.includes('st') ||
                    lowerPart.includes('avenue') ||
                    lowerPart.includes('ave') ||
                    lowerPart.includes('lane') ||
                    lowerPart.includes('goli') ||
                    /^(house|building|shop)/i.test(lowerPart) ||
                    /^(no\.?\s*\d+)/i.test(part);
    
    // Check if this is an area/moholla
    const isArea = lowerPart.includes('para') ||
                  lowerPart.includes('moholla') ||
                  lowerPart.includes('housing') ||
                  lowerPart.includes('block') ||
                  lowerPart.includes('sector') ||
                  lowerPart.includes('area') ||
                  lowerPart.includes('nagar') ||
                  lowerPart.includes('bazaar');
    
    // Check if this is a thana/city
    const isCity = lowerPart === 'dhaka' ||
                  lowerPart === 'chittagong' ||
                  lowerPart === 'sylhet' ||
                  lowerPart === 'khulna' ||
                  lowerPart === 'rajshahi' ||
                  lowerPart === 'barisal' ||
                  lowerPart === 'rangpur' ||
                  lowerPart === 'mymensingh' ||
                  lowerPart.includes('thana');
    
    // Priority order: Street > Area > City
    // But we want to keep the sequence
    
    // Add part if it's meaningful
    if (isStreet || isArea || isCity || resultParts.length < 2) {
      // Avoid duplicates
      if (!resultParts.includes(part)) {
        resultParts.push(part);
      }
    }
    
    // Stop when we have 3 parts
    if (resultParts.length >= 3) break;
  }
  
  // Ensure we have at least something
  if (resultParts.length === 0 && parts.length > 0) {
    // Take first non-admin part
    for (const part of parts) {
      const lowerPart = part.toLowerCase();
      if (!lowerPart.includes('division') && 
          !lowerPart.includes('district') && 
          !lowerPart.includes('metropolitan') &&
          !lowerPart.includes(' upazila') &&
          !lowerPart.includes(' union')) {
        resultParts.push(part);
        break;
      }
    }
  }
  
  // If still empty, just take first part
  if (resultParts.length === 0 && parts.length > 0) {
    resultParts.push(parts[0]);
  }
  
  // Format: remove "Dhaka" if it appears multiple times
  const uniqueParts = resultParts.filter((part, index, array) => {
    const lowerPart = part.toLowerCase();
    if (lowerPart === 'dhaka') {
      return array.findIndex(p => p.toLowerCase() === 'dhaka') === index;
    }
    return true;
  });
  
  const result = uniqueParts.join(', ');
  
  // Final cleanup - if result is too long
  return result.length > 50 ? result + '...' : result;
};