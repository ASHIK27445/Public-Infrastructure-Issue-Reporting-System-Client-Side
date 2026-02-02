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
      
      // Only add if it's a meaningful district name AND not already in resultParts
      if (districtName) {
        const exists = resultParts.some(p => p.toLowerCase() === districtName.toLowerCase());
        if (!exists) {
          resultParts.push(districtName);
        }
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
    
    // Add part if it's meaningful
    // Priority: Always include city, include area/street if space permits
    if (isCity) {
      // Always include city name (Dhaka, Chittagong, etc.)
      const exists = resultParts.some(p => p.toLowerCase() === part.toLowerCase());
      if (!exists) {
        resultParts.push(part);
      }
    } else if (isStreet || isArea || resultParts.length < 2) {
      // For street/area, add only if we have less than 2 parts already
      // OR if it's one of the first few parts of the address
      if (i < 3 || resultParts.length < 3) {
        const exists = resultParts.some(p => p.toLowerCase() === part.toLowerCase());
        if (!exists) {
          resultParts.push(part);
        }
      }
    }
    
    // Modified: Don't break at 3 parts if we haven't found the city yet
    // Only break if we have at least 3 parts AND we have a city
    const hasCity = resultParts.some(p => 
      ['dhaka', 'chittagong', 'sylhet', 'khulna', 'rajshahi', 'barisal', 'rangpur', 'mymensingh']
      .includes(p.toLowerCase())
    );
    
    if (resultParts.length >= 4 || (resultParts.length >= 3 && hasCity)) {
      break;
    }
  }
  
  // If we don't have a city but have other parts, try to find city
  if (resultParts.length > 0) {
    const hasCity = resultParts.some(p => 
      ['dhaka', 'chittagong', 'sylhet', 'khulna', 'rajshahi', 'barisal', 'rangpur', 'mymensingh']
      .includes(p.toLowerCase())
    );
    
    if (!hasCity) {
      // Look for city in the original parts
      for (const part of parts) {
        const lowerPart = part.toLowerCase();
        if (lowerPart === 'dhaka' ||
            lowerPart === 'chittagong' ||
            lowerPart === 'sylhet' ||
            lowerPart === 'khulna' ||
            lowerPart === 'rajshahi' ||
            lowerPart === 'barisal' ||
            lowerPart === 'rangpur' ||
            lowerPart === 'mymensingh') {
          
          const exists = resultParts.some(p => p.toLowerCase() === part.toLowerCase());
          if (!exists) {
            resultParts.push(part);
            break;
          }
        }
      }
    }
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
  
  // Remove duplicates (case insensitive)
  const uniqueParts = [];
  const seen = new Set();
  
  for (const part of resultParts) {
    const lowerPart = part.toLowerCase();
    if (!seen.has(lowerPart)) {
      seen.add(lowerPart);
      uniqueParts.push(part);
    }
  }
  
  const result = uniqueParts.join(', ');
  
  // Final cleanup - if result is too long
  return result.length > 100 ? result.substring(0, 100) + '...' : result;
};