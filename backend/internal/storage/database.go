package storage

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Database wraps the PostgreSQL connection pool.
type Database struct {
	Pool *pgxpool.Pool
}

// Connect creates a PostgreSQL connection pool.
func Connect(ctx context.Context, databaseURL string) (*Database, error) {
	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return nil, fmt.Errorf("parse database configuration: %w", err)
	}

	config.MaxConns = 10
	config.MinConns = 1
	config.MaxConnLifetime = time.Hour
	config.MaxConnIdleTime = 30 * time.Minute

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return nil, fmt.Errorf("create database pool: %w", err)
	}

	// Confirm that PostgreSQL is reachable.
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("ping database: %w", err)
	}

	return &Database{
		Pool: pool,
	}, nil
}

// Close releases all database connections.
func (db *Database) Close() {
	if db == nil || db.Pool == nil {
		return
	}

	db.Pool.Close()
}
