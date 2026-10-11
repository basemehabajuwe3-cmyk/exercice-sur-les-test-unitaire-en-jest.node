export function isAdult(age) {
  return age >= 18;
}

export function getFullName(firstName, lastName) {
  return `${firstName} ${lastName}`;
}

export function filterUsersByName(users, search) {
  if (!search) return users;
  const lowerSearch = search.toLowerCase();
  return users.filter((user) =>
    user.name.toLowerCase().includes(lowerSearch)
  );
}

//test
//toEqual()
//toContain()