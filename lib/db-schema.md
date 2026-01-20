| table_name                | column_name                | data_type                | is_nullable |
| ------------------------- | -------------------------- | ------------------------ | ----------- |
| ai_insights               | id                         | uuid                     | NO          |
| ai_insights               | market_size                | text                     | NO          |
| ai_insights               | growth_rate                | text                     | NO          |
| ai_insights               | target_potential           | text                     | NO          |
| ai_insights               | idea_id                    | uuid                     | NO          |
| ai_insights               | key_risks                  | jsonb                    | YES         |
| ai_insights               | competitive_advantages     | jsonb                    | YES         |
| ai_insights               | regulatory_considerations  | jsonb                    | YES         |
| ai_insights               | competitors                | jsonb                    | YES         |
| ai_insights               | recommendations            | jsonb                    | YES         |
| benchmark_data            | id                         | uuid                     | NO          |
| benchmark_data            | category                   | text                     | YES         |
| benchmark_data            | stage                      | text                     | YES         |
| benchmark_data            | metric_name                | text                     | NO          |
| benchmark_data            | median_value               | numeric                  | YES         |
| benchmark_data            | best_in_class_value        | numeric                  | YES         |
| competitor_analyses       | id                         | uuid                     | NO          |
| competitor_analyses       | idea_id                    | uuid                     | NO          |
| competitor_analyses       | competitor_name            | text                     | NO          |
| competitor_analyses       | competitor_description     | text                     | YES         |
| competitor_analyses       | market_position            | text                     | YES         |
| competitor_analyses       | funding_raised             | numeric                  | YES         |
| competitor_analyses       | status                     | text                     | YES         |
| competitor_analyses       | strengths                  | jsonb                    | YES         |
| competitor_analyses       | weaknesses                 | jsonb                    | YES         |
| competitor_analyses       | market_share_estimated     | numeric                  | YES         |
| competitor_analyses       | created_at                 | timestamp with time zone | NO          |
| compliance_checks         | id                         | uuid                     | NO          |
| compliance_checks         | idea_id                    | uuid                     | NO          |
| compliance_checks         | rule_name                  | character varying        | NO          |
| compliance_checks         | rule_description           | text                     | NO          |
| compliance_checks         | passed                     | boolean                  | NO          |
| compliance_checks         | checked_at                 | timestamp with time zone | NO          |
| customer_segments         | id                         | uuid                     | NO          |
| customer_segments         | idea_id                    | uuid                     | NO          |
| customer_segments         | segment_name               | text                     | NO          |
| customer_segments         | segment_size_estimate      | integer                  | YES         |
| customer_segments         | willingness_to_pay         | numeric                  | YES         |
| customer_segments         | pain_points                | jsonb                    | YES         |
| detailed_analysis_reports | id                         | uuid                     | NO          |
| detailed_analysis_reports | idea_id                    | uuid                     | NO          |
| detailed_analysis_reports | executive_summary          | text                     | YES         |
| detailed_analysis_reports | market_analysis            | jsonb                    | YES         |
| detailed_analysis_reports | competitive_analysis       | jsonb                    | YES         |
| detailed_analysis_reports | customer_analysis          | jsonb                    | YES         |
| detailed_analysis_reports | risk_assessment            | jsonb                    | YES         |
| detailed_analysis_reports | recommendations            | jsonb                    | YES         |
| detailed_analysis_reports | generated_at               | timestamp with time zone | NO          |
| failure_analyses          | id                         | uuid                     | NO          |
| failure_analyses          | idea_id                    | uuid                     | YES         |
| failure_analyses          | startup_name               | text                     | NO          |
| failure_analyses          | category                   | text                     | YES         |
| failure_analyses          | primary_failure_reason     | text                     | NO          |
| failure_analyses          | secondary_failure_reasons  | jsonb                    | YES         |
| failure_analyses          | lessons_learned            | jsonb                    | YES         |
| failure_analyses          | preventive_measures        | jsonb                    | YES         |
| funding_sources           | id                         | uuid                     | NO          |
| funding_sources           | name                       | text                     | NO          |
| funding_sources           | funder_type                | text                     | YES         |
| funding_sources           | category_focus             | jsonb                    | YES         |
| funding_sources           | stage_focus                | jsonb                    | YES         |
| funding_sources           | typical_check_size_min     | numeric                  | YES         |
| funding_sources           | typical_check_size_max     | numeric                  | YES         |
| healthcare_market_data    | id                         | uuid                     | NO          |
| healthcare_market_data    | category                   | text                     | NO          |
| healthcare_market_data    | market_size_usd            | numeric                  | YES         |
| healthcare_market_data    | market_growth_rate_percent | numeric                  | YES         |
| healthcare_market_data    | market_gaps                | jsonb                    | YES         |
| healthcare_market_data    | market_trends              | jsonb                    | YES         |
| healthcare_market_data    | opportunity_score          | numeric                  | YES         |
| healthcare_market_data    | last_updated               | timestamp with time zone | NO          |
| market_trends             | id                         | uuid                     | NO          |
| market_trends             | category                   | text                     | YES         |
| market_trends             | trend_name                 | text                     | NO          |
| market_trends             | trend_description          | text                     | YES         |
| market_trends             | relevance_score            | numeric                  | YES         |
| market_trends             | trend_status               | text                     | YES         |
| regulatory_frameworks     | id                         | uuid                     | NO          |
| regulatory_frameworks     | category                   | text                     | YES         |
| regulatory_frameworks     | jurisdiction               | text                     | YES         |
| regulatory_frameworks     | requirement_name           | text                     | NO          |
| regulatory_frameworks     | requirement_description    | text                     | YES         |
| regulatory_frameworks     | approval_body              | text                     | YES         |
| regulatory_frameworks     | severity_level             | text                     | YES         |
| regulatory_frameworks     | updated_at                 | timestamp with time zone | NO          |
| reports                   | id                         | uuid                     | NO          |
| reports                   | idea_id                    | uuid                     | NO          |
| reports                   | user_id                    | uuid                     | NO          |
| reports                   | file_url                   | character varying        | NO          |
| reports                   | generated_at               | timestamp with time zone | NO          |
| risk_profiles             | id                         | uuid                     | NO          |
| risk_profiles             | idea_id                    | uuid                     | NO          |
| risk_profiles             | risk_type                  | text                     | NO          |
| risk_profiles             | risk_name                  | text                     | NO          |
| risk_profiles             | risk_description           | text                     | YES         |
| risk_profiles             | probability_percent        | numeric                  | YES         |
| risk_profiles             | impact_level               | text                     | YES         |
| risk_profiles             | mitigation_strategies      | jsonb                    | YES         |
| scores                    | id                         | uuid                     | NO          |
| scores                    | idea_id                    | uuid                     | NO          |
| scores                    | feasibility                | numeric                  | NO          |
| scores                    | compliance_score           | numeric                  | NO          |
| scores                    | market_demand              | numeric                  | NO          |
| scores                    | cultural_acceptance        | numeric                  | NO          |
| scores                    | cost_viability             | numeric                  | NO          |
| scores                    | readiness_score            | numeric                  | NO          |
| scores                    | calculated_at              | timestamp with time zone | NO          |
| startup_ideas             | id                         | uuid                     | NO          |
| startup_ideas             | user_id                    | uuid                     | NO          |
| startup_ideas             | title                      | character varying        | NO          |
| startup_ideas             | description                | text                     | NO          |
| startup_ideas             | domain                     | character varying        | NO          |
| startup_ideas             | subdomain                  | character varying        | NO          |
| startup_ideas             | problem_statement          | text                     | NO          |
| startup_ideas             | target_audience            | text                     | NO          |
| startup_ideas             | unique_value_proposition   | text                     | NO          |
| startup_ideas             | category                   | character varying        | NO          |
| startup_ideas             | stage                      | character varying        | NO          |
| startup_ideas             | team_size                  | character varying        | YES         |
| startup_ideas             | funding_needed             | character varying        | YES         |
| startup_ideas             | status                     | USER-DEFINED             | NO          |
| startup_ideas             | submitted_at               | timestamp with time zone | NO          |
| startup_ideas             | fully_analyzed             | boolean                  | NO          |
| startup_ideas             | full_analysis_done         | boolean                  | YES         |
| strategic_recommendations | id                         | uuid                     | NO          |
| strategic_recommendations | idea_id                    | uuid                     | NO          |
| strategic_recommendations | recommendation_type        | text                     | NO          |
| strategic_recommendations | recommendation_content     | text                     | NO          |
| strategic_recommendations | priority_level             | text                     | YES         |
| strategic_recommendations | expected_impact_on_score   | numeric                  | YES         |
| strategic_recommendations | implementation_difficulty  | text                     | YES         |
| success_analyses          | id                         | uuid                     | NO          |
| success_analyses          | idea_id                    | uuid                     | YES         |
| success_analyses          | startup_name               | text                     | NO          |
| success_analyses          | category                   | text                     | YES         |
| success_analyses          | exit_type                  | text                     | YES         |
| success_analyses          | exit_valuation             | numeric                  | YES         |
| success_analyses          | success_factors            | jsonb                    | YES         |
| success_analyses          | lessons_learned            | jsonb                    | YES         |
| users                     | id                         | uuid                     | NO          |
| users                     | email                      | character varying        | NO          |
| users                     | full_name                  | character varying        | NO          |
| users                     | role                       | USER-DEFINED             | NO          |
| users                     | created_at                 | timestamp with time zone | NO          |
| users                     | updated_at                 | timestamp with time zone | NO          |