ALTER TABLE `engagement_survey_compare_mapping` 
 ADD CONSTRAINT `fk_engagement_survey_compare_mapping_1` FOREIGN KEY (`company_code`)
   REFERENCES company_master (company_code);
