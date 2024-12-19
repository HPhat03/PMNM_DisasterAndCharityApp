INSERT INTO authority_setting 
SELECT 
  aus.company_code, 
  aus.role_div, 
  dasm.function_id, 
  dasm.authority_flag, 
  dasm.regist_company_code, 
  dasm.regist_user_code, 
  dasm.regist_datetime, 
  dasm.last_update_company_code, 
  dasm.last_update_user_code, 
  dasm.last_update_datetime 
FROM 
  (
    SELECT 
      aus.company_code, 
      aus.role_div 
    FROM 
      authority_setting AS aus 
    WHERE 
      function_id = '0'
  ) AS aus 
  INNER JOIN (
    SELECT 
      dasm.role_div, 
      dasm.function_id, 
      dasm.authority_flag, 
      dasm.regist_company_code, 
      dasm.regist_user_code, 
      dasm.regist_datetime, 
      dasm.last_update_company_code, 
      dasm.last_update_user_code, 
      dasm.last_update_datetime 
    FROM 
      default_authority_setting_master AS dasm 
    WHERE 
      function_id IN (2502,2503,2504,2505)
  ) AS dasm ON aus.role_div = dasm.role_div;
  
