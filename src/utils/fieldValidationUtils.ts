type ValidationRules = {
    required: string[];
    optional?: string[];
  };
  
  export const validateFields = (
    data: Record<string, any>,
    rules: ValidationRules
  ): { valid: boolean; error: string } => {
    const { required, optional = [] } = rules;
    const errors: string[] = [];
  
    // Validate required fields
    required.forEach((field) => {
      if (!data[field] || typeof data[field] === "string" && data[field].trim().length === 0) {
        errors.push(`"${field}"`);
      }
    });

    if(errors.length > 0){
        return {valid: false, error: errors.join(", ") + " field" + (errors.length > 1 ? "s" : "") + " required."};
    }

    optional.forEach((field) => {
        if(data[field] && typeof data[field] === "string" && data[field].trim().length === 0){
            errors.push(`"${field}"`);
        }
    });

    if(errors.length > 0){
        return {valid: false, error: errors.join(", ") + " field" + (errors.length > 1 ? "s" : "") + " cannot be empty."};
    } 

    

    return { valid: true, error: "" };
  };
  