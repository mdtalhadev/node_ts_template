import { log } from "console";
import { Query } from "mongoose";

export const buildQuery = <T>(
  query: Query<T, any>,
  queryParams: Record<string, any>
): Query<T, any> => {

  const { sort, page, limit, populate, ...otherFilters } = queryParams;
  

  Object.keys(otherFilters).forEach((key) => {
    const value = otherFilters[key];
    if(Object.prototype.toString.call(value) === "[object Object]"){
      Object.entries(value).forEach(([oKey, oValue]) => {
        log(oKey, oValue);
        query = query.find({ [key]: { [`$${oKey}`]: oValue } }) as Query<T, any>;
      })     
    } else {
      query = query.find({ [key]: value }) as Query<T, any>;
    }
  });
  if (sort) {
    query = query.sort(sort);
  }

  const itemsPerPage = parseInt(limit as string) || 10;
  const currentPage = parseInt(page as string) || 1;
  query = query.skip((currentPage - 1) * itemsPerPage).limit(itemsPerPage);

  if (populate) {
    try {
      const populateOptions = typeof populate === "string" ? JSON.parse(populate) : populate;
      if (Array.isArray(populateOptions)) {
        populateOptions.forEach((option) => {
          query.populate(option);
        });
      } else {
        query.populate(populateOptions);
      }
    } catch (error) {
      throw new Error("Invalid populate format. Ensure it's a valid JSON string.");
    }
  }

  return query;
};