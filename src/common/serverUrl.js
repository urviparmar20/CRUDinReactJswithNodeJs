const mainUrl = "http://localhost:8080";

// book
const get_book_list = mainUrl + "/books";
const create_book = mainUrl + "/books";
const update_book = mainUrl + "/books";
const get_book_using_id_list = mainUrl + "/books";
const delete_book = mainUrl + "/books/delete";

// auth
const sign_in = mainUrl + "/signin";
const sign_up = mainUrl + "/signup";

export {
  get_book_list,
  create_book,
  update_book,
  get_book_using_id_list,
  delete_book,
  sign_in,
  sign_up,
};
