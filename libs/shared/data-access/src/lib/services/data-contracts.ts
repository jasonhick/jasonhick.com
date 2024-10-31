 
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Client {
  id?: number;
  /** Client name */
  name: string;
  /** Client description */
  description?: string;
  /** Client website URL */
  website?: string;
  /** Client logo URL */
  logo_url?: string;
  /**
   * Project start date
   * @format date-time
   */
  start_date?: string;
  /**
   * Project end date
   * @format date-time
   */
  end_date?: string;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

export interface Project {
  id?: number;
  /** Project title */
  title: string;
  /** Project description */
  description: string;
  /** Project features */
  features?: string[];
  /** Thumbnail URL */
  thumbnail_url: string;
  /** Live project URL */
  live_url?: string;
  /** GitHub repository URL */
  github_url?: string;
  /**
   * Project start date
   * @format date-time
   */
  start_date: string;
  /**
   * Project end date
   * @format date-time
   */
  end_date: string;
  /** Featured project status */
  is_featured?: boolean;
  /** Associated client ID */
  client_id?: number;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

export interface Image {
  id?: number;
  /** Image URL */
  url: string;
  /** Image caption */
  caption?: string;
  /** Display order */
  order?: number;
  /** Associated project ID */
  project_id: number;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

export interface Skill {
  id?: number;
  /** Skill name */
  name: string;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}
