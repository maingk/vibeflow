-- Migration: Add assignee field to cards table
-- Run this SQL in your Supabase SQL Editor

-- Add assignee column to cards table
ALTER TABLE cards ADD COLUMN IF NOT EXISTS assignee TEXT;

-- Create index for assignee queries
CREATE INDEX IF NOT EXISTS idx_cards_assignee ON cards(assignee);
