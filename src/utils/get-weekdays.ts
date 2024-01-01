export function getWeekdays() {
  const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' });

  return Array.from(Array(7).keys())
    .map(day => formatter.format(new Date(Date.UTC(2021, 2, day))))
    .map((weekday) => weekday.substring(0, 1).toUpperCase().concat(weekday.substring(1)));
}