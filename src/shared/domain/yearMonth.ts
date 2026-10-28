const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Calendar-month value object. `month` is 1..12. It carries no locale: display
 * labels are produced by the formatters layer from the configured locale.
 */
export class YearMonth {
  private constructor(
    readonly year: number,
    readonly month: number,
  ) {}

  static of(year: number, month: number): YearMonth {
    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
      throw new RangeError(`Invalid year-month: ${year}-${month}`)
    }
    return new YearMonth(year, month)
  }

  static fromIsoDate(iso: string): YearMonth {
    const [y, m] = iso.split('-').map(Number)
    return YearMonth.of(y ?? Number.NaN, m ?? Number.NaN)
  }

  /** Uses the local calendar (what a person would call "today" where they are). */
  static fromDate(date: Date): YearMonth {
    return YearMonth.of(date.getFullYear(), date.getMonth() + 1)
  }

  get key(): string {
    return `${this.year}-${pad(this.month)}`
  }

  /** True when the ISO date (YYYY-MM-DD) falls in this calendar month. */
  contains(iso: string): boolean {
    return iso.slice(0, 7) === this.key
  }

  previous(): YearMonth {
    return this.month === 1 ? YearMonth.of(this.year - 1, 12) : YearMonth.of(this.year, this.month - 1)
  }

  daysInMonth(): number {
    return new Date(this.year, this.month, 0).getDate()
  }

  /** ISO date for a day of this month, clamped to 1..daysInMonth. */
  dayIso(day: number): string {
    const clamped = Math.min(Math.max(day, 1), this.daysInMonth())
    return `${this.key}-${pad(clamped)}`
  }

  /** Midday local Date on the first of the month: a safe anchor for Intl formatting. */
  toDate(): Date {
    return new Date(this.year, this.month - 1, 1, 12, 0, 0)
  }

  equals(other: YearMonth): boolean {
    return this.key === other.key
  }
}
