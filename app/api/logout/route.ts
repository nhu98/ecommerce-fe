export async function POST() {
  return new Response(JSON.stringify({ message: 'Đăng xuất thành công' }), {
    status: 200,
    headers: {
      'Set-Cookie': 'sessionToken=; Path=/; HttpOnly; Max-Age=0',
    },
  });
}
