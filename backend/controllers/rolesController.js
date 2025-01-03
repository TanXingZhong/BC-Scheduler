const db_roles = require("../model/db_roles");

// @desc Get all roles
// @route GET /roles
// @access Private
const getAllRoles = async (req, res) => {
  // Get all users from SQL
  try {
    const allRoles = await db_roles.getAllRoles();
    return res.status(200).json({ rows: allRoles });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching roles." });
  }
};

// @desc Create new role
// @route POST /roles
// @access Private
const createNewRole = async (req, res) => {
  const { role_name, color } = req.body;

  // Confirm data
  if (!role_name) {
    return res.status(400).json({ message: "Role name required." });
  }
  // Check for duplicate role
  try {
    const duplicate = await db_roles.checkRoleExist(role_name);
    if (duplicate) {
      return res.status(409).json({ message: "Role name already taken." });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error checking for duplicated role." });
  }

  try {
    await db_roles.addRole(role_name, color);
    return res.status(201).json({ message: `New role ${role_name} created!` });
  } catch (err) {
    return res.status(500).json({ message: "Error creating new role." });
  }
};

// @desc Update a role
// @route PATCH /roles
// @access Private
const updateRole = async (req, res) => {
  const data = req.body;
  // Confirm data
  if (!data.id || !data.role_name || !data.color) {
    return res.status(400).json({ message: "Missing Informations" });
  }

  // Does the role exist to update?
  try {
    const exist = await db_roles.checkRoleExistById(data.id);
    if (!exist) {
      return res.status(404).json({ message: "Role not found." });
    }
    const duplicate = await db_roles.checkRoleExistExceptItsOwn(
      data.role_name,
      data.id
    );
    if (duplicate) {
      return res.status(409).json({ message: "Role name already taken." });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error checking for role." });
  }

  // Allow updates to the original user
  try {
    await db_roles.updateRole(data);
    return res.status(200).json({ message: `Role updated!` });
  } catch (err) {
    return res.status(500).json({ message: "Error updating of a role." });
  }
};

// @desc Delete a role
// @route DELETE /roles
// @access Private
const deleteRole = async (req, res) => {
  const { role_name } = req.body;

  // Confirm data
  if (!role_name) {
    return res.status(400).json({ message: "Role name required." });
  }
  // Does the role exist to delete?
  try {
    const exist = await db_roles.checkRoleExist(role_name);
    if (!exist) {
      return res.status(404).json({ message: "Role not found." });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error checking for role." });
  }
  // Delete the user
  try {
    await db_roles.deleteRole(role_name);
    return res.status(200).json({ message: `Role ${role_name} deleted!` });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting role." });
  }
};

module.exports = {
  getAllRoles,
  createNewRole,
  updateRole,
  deleteRole,
};
