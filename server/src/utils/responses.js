function ok(res, data = null, meta = {}) {
  return res.json({
    ok: true,
    data,
    meta,
  })
}

function fail(res, code, message, statusCode = 400) {
  return res.status(statusCode).json({
    ok: false,
    error: {
      code,
      message,
    },
  })
}

module.exports = { ok, fail }
